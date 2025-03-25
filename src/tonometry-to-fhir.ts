import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { CodingArgs } from "@fhir-typescript/r4b-core/dist/fhir/Coding";
import { IOPMethod, TonometrieData } from "./tonometryData.ts";
import { ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/fhirValueSets/ObservationStatusCodes";

const IOPMethod2Fhir = {
	[IOPMethod.Applanation]: [snomed("252803002", "Applanation tonometry")],
	[IOPMethod.Pneumatic]: [snomed("252804008", "Pneumatic tonometry")],
	[IOPMethod.Extended]: [snomed("252833009", "Extended tonometry")],
	[IOPMethod.ExtendedOffice]: [snomed("252835002", "Extended tonometry - office hours")],
	[IOPMethod.Extended24]: [snomed("252836001", "Extended tonometry - 24 hours")],
	[IOPMethod.Schiotz]: [snomed("389149000", "Schiotz tonometry (procedure)")],
	[IOPMethod.NonContact]: [snomed("389150000", "Non-contact tonometry (procedure)")],
	[IOPMethod.Perkins]: [snomed("389151001", "Perkins applanation tonometry (procedure)")],
	[IOPMethod.Glodmann]: [snomed("389152008", "Goldmann applanation tonometry (procedure)")],
	[IOPMethod.Indentation]: [snomed("392338001", "Indentation tonometry (procedure)")],
	[IOPMethod.Rebound]: [snomed("1286870002", "Rebound tonometry (procedure)")],
	[IOPMethod.Mackay]: [snomed("1286871003", "Mackay-Marg tonometry")],
	[IOPMethod.Dynamic]: [snomed("1286902005", "Dynamic contour tonometry (procedure)")],
	[IOPMethod.Corneal]: [
		snomed("1286906008", "Corneal compensated tonometry using ocular response analyzer (procedure)"),
	],
	[IOPMethod.Ocular]: [snomed("1286913008", "Ocular response analyzer tonometry - Goldmann-correlated")],
	[IOPMethod.Digital]: [snomed("1286917009", "Digital tonometry")],
	[IOPMethod.Portable]: [snomed("1286918004", "Portable electronic applanation tonometry (procedure)")],
	[IOPMethod.ReboundRemote]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/iop-methods",
			code: "rebound-tonometry-remote",
			display: "Rebound tonometry remote",
		},
	],
	[IOPMethod.Contact]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/iop-methods",
			code: "contact-lens-tonometry",
			display: "Contact lens tonometry",
		},
	],
};

export function tonometry2Fhir(data: TonometrieData): Observation[] {
	let left = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [loinc("56844-4", "Intraocular pressure of Eye"), snomed("41633001", "Intraocular pressure")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.leftEye.pressure,
			unit: "mm[Hg]",
			system: "http://unitsofmeasure.org",
			code: "mm[Hg]",
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
		method: {
			coding: IOPMethod2Fhir[data.iopMethod],
		},
		component: [
			{
				code: {
					coding: [
						{
							system: "http://snomed.info/sct",
							code: "37125009",
							display: "Dilated pupil (finding)",
						},
					],
				},
				valueCodeableConcept: {
					coding: [
						data.leftEye.mydriasis
							? snomed("398166005", "Performed (qualifier value)")
							: snomed("262008008", "Not performed (qualifier value)"),
					],
				},
			},
		],
	});

	let right = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [loinc("56844-4", "Intraocular pressure of Eye"), snomed("41633001", "Intraocular pressure")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.rightEye.pressure,
			unit: "mm[Hg]",
			system: "http://unitsofmeasure.org",
			code: "mm[Hg]",
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
		method: {
			coding: IOPMethod2Fhir[data.iopMethod],
		},
		component: [
			{
				code: {
					coding: [snomed("37125009", "Dilated pupil (finding)")],
				},
				valueCodeableConcept: {
					coding: [
						data.rightEye.mydriasis
							? snomed("398166005", "Performed (qualifier value)")
							: snomed("262008008", "Not performed (qualifier value)"),
					],
				},
			},
		],
	});

	return [left, right];
}

export function snomed(code: string, display: string): CodingArgs {
	return { system: "http://snomed.info/sct", code, display };
}

export function loinc(code: string, display: string): CodingArgs {
	return { system: "http://loinc.org", code, display };
}
