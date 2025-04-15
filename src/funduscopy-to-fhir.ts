import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { snomed, loinc } from "./tonometry-to-fhir.ts";
import { FunduscopyData, PresenceStatus } from "./funduscopyData.ts";
import { ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/fhirValueSets/ObservationStatusCodes";
import { Bundle } from "@fhir-typescript/r4b-core/dist/fhir";

const PresenceStatus2Fhir = {
	[PresenceStatus.Present]: [snomed("52101004", "Present (qualifier value)")],
	[PresenceStatus.Absent]: [snomed("2667000", "Absent (qualifier value)")],
	[PresenceStatus.Unknown]: [snomed("261665006", "Unknown (qualifier value)")],
};

export function funduscopy2Fhir(data: FunduscopyData): Bundle[] {
	let papillEdemaLeft = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("423341008", "Edema of optic disc (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.leftEye.papillEdema],
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let macularEdemaLeft = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("37231002", "Macular retinal edema (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.leftEye.macularEdema],
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let vascuitisLeft = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("77628002", "Retinal vasculitis (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.leftEye.vascuitis],
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let left = new Bundle({
		resourceType: "Bundle",
		type: "collection",
		entry: [{ resource: papillEdemaLeft }, { resource: macularEdemaLeft }, { resource: vascuitisLeft }],
	});

	let papillEdemaRight = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("423341008", "Edema of optic disc (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.rightEye.papillEdema],
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let macularEdemaRight = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("37231002", "Macular retinal edema (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.rightEye.macularEdema],
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let vascuitisRight = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("77628002", "Retinal vasculitis (disorder)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueCodeableConcept: {
			coding: PresenceStatus2Fhir[data.rightEye.vascuitis],
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let right = new Bundle({
		resourceType: "Bundle",
		type: "collection",
		entry: [{ resource: papillEdemaRight }, { resource: macularEdemaRight }, { resource: vascuitisRight }],
	});

	return [left, right];
}
