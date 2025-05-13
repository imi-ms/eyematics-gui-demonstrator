import { Bundle, Medication, MedicationRequest, Reference } from "@fhir-typescript/r4b-core/dist/fhir";
import { IVIData, IVIMedication, IVIRegimen } from "./ivi-data.ts";
import { snomed } from "./tonometry-to-fhir.ts";
import {
	MedicationrequestIntentCodes,
	MedicationrequestStatusCodes,
} from "@fhir-typescript/r4b-core/dist/valueSetCodes";
import { isValidMedReq } from "./ivi-component.ts";

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

	if (isValidMedReq(data.leftEye)) {
		let medicationLeft = await _load_medication(data.leftEye.medication);

		let medReqLeft = new MedicationRequest({
			status: MedicationrequestStatusCodes.Active,
			intent: MedicationrequestIntentCodes.Order,
			medication: new Reference({
				reference: `IVIMedication/${medicationLeft.id}`,
				display: "Prescribed Medication",
			}),
			subject: new Reference({ reference: `Patient/${patientID}`, display: "Treated Patient" }),
			authoredOn: new Date(data.recordedDate).toISOString(),
			note: [
				{
					text: data.leftEye.note,
				},
			],
			dosageInstruction: [
				{
					site: { coding: [snomed("1290041000", "Entire left eye proper (body structure)")] },
					timing: {
						repeat: {
							period: data.leftEye.treatment.min,
							periodMax: data.leftEye.treatment.max,
						},
					},
					asNeededBoolean: data.leftEye.treatment.regimen === IVIRegimen.PRN,
					extension: [
						{
							url: "https://eyematics.org/fhir/eyematics-kds/StructureDefinition/extension-ivi-treatment-regimen",
							valueCodeableConcept: {
								coding: Regimen2Fhir[data.leftEye.treatment.regimen],
							},
						},
					],
				},
			],
		});

		let left = new Bundle({
			type: "collection",
			entry: [{ resource: medReqLeft }, { resource: medicationLeft }],
		});

		result.push(left);
	}

	if (isValidMedReq(data.rightEye)) {
		let medicationRight = await _load_medication(data.rightEye.medication);

		let medReqRight = new MedicationRequest({
			status: MedicationrequestStatusCodes.Active,
			intent: MedicationrequestIntentCodes.Order,
			medication: new Reference({
				reference: `IVIMedication/${medicationRight.id}`,
				display: "Prescribed Medication",
			}),
			subject: new Reference({ reference: `Patient/${patientID}`, display: "Treated Patient" }),
			authoredOn: new Date(data.recordedDate).toISOString(),
			note: [
				{
					text: data.rightEye.note,
				},
			],
			dosageInstruction: [
				{
					site: { coding: [snomed("1290043002", "Entire right eye proper (body structure)")] },
					timing: {
						repeat: {
							period: data.rightEye.treatment.min,
							periodMax: data.rightEye.treatment.max,
						},
					},
					asNeededBoolean: data.rightEye.treatment.regimen === IVIRegimen.PRN,
					extension: [
						{
							url: "https://eyematics.org/fhir/eyematics-kds/StructureDefinition/extension-ivi-treatment-regimen",
							valueCodeableConcept: {
								coding: Regimen2Fhir[data.rightEye.treatment.regimen],
							},
						},
					],
				},
			],
		});

		let right = new Bundle({
			type: "collection",
			entry: [{ resource: medReqRight }, { resource: medicationRight }],
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
