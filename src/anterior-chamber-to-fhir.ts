import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { snomed, loinc } from "./tonometry-to-fhir.ts";

import { ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/fhirValueSets/ObservationStatusCodes";
import { Bundle, BundleEntry, DiagnosticReport } from "@fhir-typescript/r4b-core/dist/fhir";
import { AnteriorChamberData, SUNCells, SUNFlare } from "./anterior-chamber-data.ts";

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
		resourceType: "Observation",
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
		resourceType: "Observation",
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

	let left = new Bundle({
		resourceType: "Bundle",
		type: "collection",
		entry: [{ resource: cellsLeft }, { resource: flareLeft }],
	});

	// add optional note for left eye if present
	if (!!data.leftEye.note) {
		left.entry.push(new BundleEntry({ resource: getDiagnosticReport(data.recordedDate, data.leftEye.note) }));
	}

	let cellsRight = new Observation({
		resourceType: "Observation",
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
		resourceType: "Observation",
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

	let right = new Bundle({
		resourceType: "Bundle",
		type: "collection",
		entry: [{ resource: cellsRight }, { resource: flareRight }],
	});

	// add optional note for right eye if present
	if (!!data.rightEye.note) {
		right.entry.push(new BundleEntry({ resource: getDiagnosticReport(data.recordedDate, data.rightEye.note) }));
	}

	return [left, right];
}

export function getDiagnosticReport(date: string, note: string) {
	return new DiagnosticReport({
		resourceType: "DiagnosticReport",
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
	});
}
