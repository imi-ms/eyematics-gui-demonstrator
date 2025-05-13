import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { snomed, loinc } from "./tonometry-to-fhir.ts";

import { ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/fhirValueSets/ObservationStatusCodes";
import { Bundle, BundleEntry, DiagnosticReport, Reference } from "@fhir-typescript/r4b-core/dist/fhir";
import { AnteriorChamberData, SUNCells, SUNFlare } from "./anterior-chamber-data.ts";
import { PresenceStatus2Fhir } from "./funduscopy-to-fhir.ts";

const SUNFlare2Fhir = {
	[SUNFlare.Absent]: [snomed("2667000", "Absent (qualifier value)")],
	[SUNFlare.One]: [snomed("260347006", "Present + out of ++++ (qualifier value)")],
	[SUNFlare.Two]: [snomed("260348001", "Present ++ out of ++++ (qualifier value)")],
	[SUNFlare.Three]: [snomed("260349009", "Present +++ out of ++++ (qualifier value)")],
	[SUNFlare.Four]: [snomed("260350009", "Present ++++ out of ++++ (qualifier value)")],
};

const SUNCells2Fhir = {
	...SUNFlare2Fhir,
	[SUNCells.Half]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/sun-grades",
			code: "(+)",
			display: "Present (+) out of ++++ (qualifier value)",
		},
	],
};

export function anteriorChamber2Fhir(data: AnteriorChamberData): Bundle[] {
	let cellsLeft = new Observation({
		id: "cells-left",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("246993000", "Anterior chamber cells (finding)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: SUNCells2Fhir[data.leftEye.cells],
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let flareLeft = new Observation({
		id: "flare-left",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("246992005", "Anterior chamber flare (finding)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: SUNFlare2Fhir[data.leftEye.flare],
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let synechiaeLeft = new Observation({
		id: "synechiae-left",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("78778007", "Adhesions of iris (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.leftEye.synechiae],
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let left = new Bundle({
		type: "collection",
		entry: [{ resource: cellsLeft }, { resource: flareLeft }, { resource: synechiaeLeft }],
	});

	// add optional note for left eye if present
	if (!!data.leftEye.note) {
		left.entry.push(
			new BundleEntry({
				resource: getDiagnosticReport(data.recordedDate, data.leftEye.note, [cellsLeft, flareLeft]),
			})
		);
	}

	let cellsRight = new Observation({
		id: "cells-right",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("246993000", "Anterior chamber cells (finding)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: SUNCells2Fhir[data.rightEye.cells],
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let flareRight = new Observation({
		id: "flare-right",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("246992005", "Anterior chamber flare (finding)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: SUNFlare2Fhir[data.rightEye.flare],
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let synechiaeRight = new Observation({
		id: "synechiae-right",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("78778007", "Adhesions of iris (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.rightEye.synechiae],
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let right = new Bundle({
		type: "collection",
		entry: [{ resource: cellsRight }, { resource: flareRight }, { resource: synechiaeRight }],
	});

	// add optional note for right eye if present
	if (!!data.rightEye.note) {
		right.entry.push(
			new BundleEntry({
				resource: getDiagnosticReport(data.recordedDate, data.rightEye.note, [cellsRight, flareRight]),
			})
		);
	}

	return [left, right];
}

export function getDiagnosticReport(date: string, note: string, results: Observation[]) {
	return new DiagnosticReport({
		status: ObservationStatusCodes.Final,
		category: [
			{
				coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }],
			},
		],
		code: {
			coding: [loinc("78573-3", "Ophthalmology Diagnostic study note")],
		},
		effectiveDateTime: new Date(date).toISOString(),
		conclusion: note,
		result: results.map((r) => new Reference({ reference: `${r.resourceType}/${r.id}` })),
	});
}
