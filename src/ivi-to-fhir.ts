import {
	Bundle,
	Medication,
	MedicationAdministration,
	Observation,
	Reference,
} from "@fhir-typescript/r4b-core/dist/fhir";
import { IVIData, IVIMedication, IVIRegimen } from "./ivi-data.ts";
import { snomed } from "./tonometry-to-fhir.ts";
import { MedicationAdminStatusCodes, ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/valueSetCodes";
import { isValidMedicationAdmin } from "./ivi-component.ts";
import { PresenceStatus2Fhir } from "./funduscopy-to-fhir.ts";
import { PresenceStatus } from "./funduscopy-data.ts";

const Medication2Fhir = {
	[IVIMedication.Af2]: "",
	[IVIMedication.Af8]: "",
	[IVIMedication.Be]: "497908-13682 Avastin 25 mg-ml CC Pharma Konzentrat.json",
	[IVIMedication.Br]: "1256905-946 Beovu- 120 mg-ml Injektionsloesung in .json",
	[IVIMedication.Fa]: "",
	[IVIMedication.Ra]: "",
	[IVIMedication.De]: "",
	[IVIMedication.Oc]: "",
};

const RegimenSystem = "https://eyematics.org/fhir/eyematics-kds/CodeSystem/ivi-treatment-regimen";

const Regimen2Fhir = {
	[IVIRegimen.Fixed]: [{ system: RegimenSystem, code: "Fixed", display: "" }],
	[IVIRegimen.PRN]: [{ system: RegimenSystem, code: "PRN", display: "" }],
	[IVIRegimen.TE]: [{ system: RegimenSystem, code: "TE", display: "" }],
};

export async function ivi2Fhir(data: IVIData): Promise<Bundle[]> {
	let result = [];
	let patientID = crypto.randomUUID();

	if (isValidMedicationAdmin(data.leftEye)) {
		let medicationLeft = await _load_medication(data.leftEye.medication);

		let medReqLeft = new MedicationAdministration({
			status: MedicationAdminStatusCodes.Completed,
			medication: new Reference({
				reference: `IVIMedication/${medicationLeft.id}`,
				display: "Prescribed Medication",
			}),
			subject: new Reference({ reference: `Patient/${patientID}`, display: "Treated Patient" }),
			effectiveDateTime: new Date(data.recordedDate).toISOString(),
			note: [
				{
					text: data.leftEye.note,
				},
			],
			dosage: {
				site: { coding: [snomed("1290041000", "Entire left eye proper (body structure)")] },
				route: {
					coding: [{ system: "http://standardterms.edqm.eu", code: "20047000", display: "Intravitreal use" }],
				},
				dose: {
					value: medicationLeft.amount.numerator.value.value / medicationLeft.amount.denominator.value.value,
					unit: medicationLeft.amount.numerator.unit,
					system: medicationLeft.amount.numerator.system,
					code: medicationLeft.amount.numerator.code,
				},
				rateQuantity: {
					value: 1,
				},
			},
		});

		let visusLeft = new Observation({
			status: ObservationStatusCodes.Final,
			category: [
				{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
			],
			code: {
				coding: [snomed("260295004", "Sees hand movements (finding)")],
			},
			effectiveDateTime: new Date(data.recordedDate).toISOString(),
			valueCodeableConcept: {
				coding: PresenceStatus2Fhir[data.leftEye.visus ? PresenceStatus.Present : PresenceStatus.Absent],
			},
			bodySite: {
				coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
			},
		});

		let left = new Bundle({
			type: "collection",
			entry: [{ resource: medReqLeft }, { resource: medicationLeft }, { resource: visusLeft }],
		});

		result.push(left);
	}

	if (isValidMedicationAdmin(data.rightEye)) {
		let medicationRight = await _load_medication(data.rightEye.medication);

		let medReqRight = new MedicationAdministration({
			status: MedicationAdminStatusCodes.Completed,
			medication: new Reference({
				reference: `IVIMedication/${medicationRight.id}`,
				display: "Prescribed Medication",
			}),
			subject: new Reference({ reference: `Patient/${patientID}`, display: "Treated Patient" }),
			effectiveDateTime: new Date(data.recordedDate).toISOString(),
			note: [
				{
					text: data.leftEye.note,
				},
			],
			dosage: {
				site: { coding: [snomed("1290043002", "Entire right eye proper (body structure)")] },
				route: {
					coding: [{ system: "http://standardterms.edqm.eu", code: "20047000", display: "Intravitreal use" }],
				},
				dose: {
					value: medicationRight.amount.numerator.value,
					unit: medicationRight.amount.numerator.unit,
					system: medicationRight.amount.numerator.system,
					code: medicationRight.amount.numerator.code,
				},
				rateQuantity: {
					value: 1,
				},
			},
		});

		let visusRight = new Observation({
			status: ObservationStatusCodes.Final,
			category: [
				{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
			],
			code: {
				coding: [snomed("260295004", "Sees hand movements (finding)")],
			},
			effectiveDateTime: new Date(data.recordedDate).toISOString(),
			valueCodeableConcept: {
				coding: PresenceStatus2Fhir[data.rightEye.visus ? PresenceStatus.Present : PresenceStatus.Absent],
			},
			bodySite: {
				coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
			},
		});

		let right = new Bundle({
			type: "collection",
			entry: [{ resource: medReqRight }, { resource: medicationRight }, { resource: visusRight }],
		});

		result.push(right);
	}

	return result;
}

async function _load_medication(medication: IVIMedication): Promise<Medication> {
	let response = await fetch(Medication2Fhir[medication]);
	let json = await response.json();

	return json as Medication;
}
