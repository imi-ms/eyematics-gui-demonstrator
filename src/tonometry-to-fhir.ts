import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { CodingArgs } from "@fhir-typescript/r4b-core/dist/fhir/Coding";
import { TonometrieData } from "./tonometryData.ts";

const IOPMethod2Fhir = {
	Applanation: [snomed("252803002", "Applanation tonometry")],
	Pneumatic: [snomed("252804008", "Pneumatic tonometry")],
	Extended: [snomed("252833009", "Extended tonometry")],
	ExtendedOffice: [snomed("252835002", "Extended tonometry - office hours")],
	Extended24: [snomed("252836001", "Extended tonometry - 24 hours")],
	Schiotz: [snomed("389149000", "Schiotz tonometry (procedure)")],
	NonContact: [snomed("389150000", "Non-contact tonometry (procedure)")],
	Perkins: [snomed("389151001", "Perkins applanation tonometry (procedure)")],
	Glodmann: [snomed("389152008", "Goldmann applanation tonometry (procedure)")],
	Indentation: [snomed("392338001", "Indentation tonometry (procedure)")],
	Rebound: [snomed("1286870002", "Rebound tonometry (procedure)")],
	Mackay: [snomed("1286871003", "Mackay-Marg tonometry")],
	Dynamic: [snomed("1286902005", "Dynamic contour tonometry (procedure)")],
	Corneal: [snomed("1286906008", "Corneal compensated tonometry using ocular response analyzer (procedure)")],
	Ocular: [snomed("1286913008", "Ocular response analyzer tonometry - Goldmann-correlated")],
	Digital: [snomed("1286917009", "Digital tonometry")],
	Portable: [snomed("1286918004", "Portable electronic applanation tonometry (procedure)")],
	ReboundRemote: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/iop-methods",
			code: "rebound-tonometry-remote",
			display: "Rebound tonometry remote",
		},
	],
	Contact: [
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
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [loinc("56844-4", "Intraocular pressure of Eye"), snomed("41633001", "Intraocular pressure")],
		},
		effectiveDateTime: data.recordedDate,
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
			coding: IOPMethod2Fhir[data.tonometryType],
		},
	});

	let right = new Observation({
		resourceType: "Observation",
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [loinc("56844-4", "Intraocular pressure of Eye"), snomed("41633001", "Intraocular pressure")],
		},
		effectiveDateTime: data.recordedDate,
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
			coding: IOPMethod2Fhir[data.tonometryType],
		},
	});

	return [left.toJSON(), right.toJSON()];
}

export function snomed(code: string, display: string): CodingArgs {
	return { system: "http://snomed.info/sct", code, display };
}

export function loinc(code: string, display: string): CodingArgs {
	return { system: "http://loinc.org", code, display };
}
