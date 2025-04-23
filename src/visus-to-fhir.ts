import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { CorrectionMethod, Optotype, TestDistance, VisusData } from "./visus-data.ts";
import { snomed, loinc } from "./tonometry-to-fhir.ts";
import { ObservationArgs, ObservationComponentArgs } from "@fhir-typescript/r4b-core/dist/fhir";
import { ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/fhirValueSets/ObservationStatusCodes";

const VisusCategories = {
	FZ: [loinc("LA24679-5", "Count fingers (CF)")],
	HBW: [snomed("260295004", "Sees hand movements (finding)")],
	LS: [snomed("260296003", "Perceives light only (finding)")],
	NL: [snomed("63063006", "Visual acuity, no light perception (finding)")],
};

const CorrectionMethod2Fhir = {
	[CorrectionMethod.Uncorrected]: [snomed("420050001", "Uncorrected visual acuity")],
	[CorrectionMethod.Glasses]: [snomed("50121007", "Eye glasses, device")],
	[CorrectionMethod.Lenses]: [snomed("57368009", "Contact lenses, device")],
	[CorrectionMethod.TLAuto]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-autorefraction",
			display: "",
		},
	],
	[CorrectionMethod.TLNoCycloplegia]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-manifest-without-cycloplegia",
			display: "",
		},
	],
	[CorrectionMethod.TLCycloplegia]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-manifest-with-cycloplegia",
			display: "",
		},
	],
	[CorrectionMethod.TLRetinoscopy]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-retinoscopy",
			display: "",
		},
	],
	[CorrectionMethod.TLNoOrigin]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-unspecified-origin",
			display: "",
		},
	],
};

const TestDistance2Fhir = {
	[TestDistance.Near]: [loinc("LA32578-9", "Near")],
	[TestDistance.Far]: [loinc("LA32577-1", "Far")],
	[TestDistance.Intermediate]: [loinc("LA16550-8", "Intermediate")],
};

const Optotype2Fhir = {
	[Optotype.Landolt]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/va-optotypes",
			code: "LandoltC",
			display: "Landolt C",
		},
	],
	[Optotype.Sjogren]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/va-optotypes",
			code: "Sjogren",
			display: "Sjogren's Hand Test",
		},
	],
	[Optotype.Lea]: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/va-optotypes",
			code: "Lea",
			display: "Lea Symbol Test",
		},
	],
	[Optotype.ETest]: [snomed("400911007", "E test (procedure)")],
	[Optotype.Kay]: [snomed("252982005", "Kay picture test")],
	[Optotype.Cambrige]: [snomed("252977003", "Cambridge crowded letter charts")],
	[Optotype.Sonsken]: [snomed("252976007", "Sonsken charts")],
	[Optotype.Sheridan]: [snomed("252978008", "Sheridan Gardiner test")],
	[Optotype.Stycar]: [snomed("252884005", "Stycar vision test")],
	[Optotype.Cardiff]: [snomed("285805006", "Cardiff acuity cards")],
	[Optotype.Teller]: [snomed("285803004", "Teller acuity cards"), loinc("LA25494-8", "Teller")],
	[Optotype.Keeler]: [snomed("285804005", "Keeler acuity cards")],
	[Optotype.Chart]: [
		snomed("400914004", "Early Treatment of Diabetic Retinopathy Study visual acuity chart (physical object)"),
	],
	[Optotype.Allen]: [loinc("LA25495-5", "Allen figure")],
	[Optotype.HOTV]: [loinc("LA25496-3", "HOTV")],
	[Optotype.Numbers]: [loinc("LA25497-1", "Numbers")],
	[Optotype.Snellen]: [loinc("LA25498-9", "Snellen")],
};

export function visus2Fhir(data: VisusData): Observation[] {
	let left = new Observation({
		resourceType: "Observation",
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("260246004", "Visual Acuity finding")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		...getVisusValue(data.leftEye.visus),
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
		component: [
			getCorrectionMethod(data.correctionMethod, true, data.leftEye.lens),
			{
				code: {
					coding: [snomed("252124009", "Test distance")],
				},
				valueCodeableConcept: {
					coding: TestDistance2Fhir[data.testDistance],
				},
			},
			{
				code: {
					coding: [
						{
							system: "https://eyematics.org/fhir/eyematics-kds/ValueSet/va-optotypes",
							code: "VS_VA_Optotypes",
							display: "Visual Acuity Optotypes (Experimental)",
						},
					],
				},
				valueCodeableConcept: {
					coding: Optotype2Fhir[data.optotype],
				},
			},
			{
				code: {
					coding: [snomed("37125009", "Dilated pupil (finding)")],
				},
				valueCodeableConcept: {
					coding: [
						data.leftEye.mydriasis
							? snomed("398166005", "Performed (qualifier value)")
							: snomed("262008008", "Not performed (qualifier value)"),
					],
				},
			},
			{
				code: {
					coding: [snomed("257492003", "Pinhole (physical object)")],
				},
				valueCodeableConcept: {
					coding: [
						data.leftEye.pinhole
							? snomed("373062004", "Device used (finding)")
							: snomed("262009000", "Not used"),
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
			coding: [snomed("260246004", "Visual Acuity finding")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		...getVisusValue(data.rightEye.visus),
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
		component: [
			getCorrectionMethod(data.correctionMethod, false, data.rightEye.lens),
			{
				code: {
					coding: [snomed("252124009", "Test distance")],
				},
				valueCodeableConcept: {
					coding: TestDistance2Fhir[data.testDistance],
				},
			},
			{
				code: {
					coding: [
						{
							system: "https://eyematics.org/fhir/eyematics-kds/ValueSet/va-optotypes",
							code: "VS_VA_Optotypes",
							display: "Visual Acuity Optotypes (Experimental)",
						},
					],
				},
				valueCodeableConcept: {
					coding: Optotype2Fhir[data.optotype],
				},
			},
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
			{
				code: {
					coding: [snomed("257492003", "Pinhole (physical object)")],
				},
				valueCodeableConcept: {
					coding: [
						data.rightEye.pinhole
							? snomed("373062004", "Device used (finding)")
							: snomed("262009000", "Not used"),
					],
				},
			},
		],
	});

	return [left, right];
}

function getVisusValue(visus: string): Partial<ObservationArgs> {
	// decimal -> valueQuantity
	if (visus.includes(",") || visus.includes(".")) {
		visus = visus.replace(",", ".");
		return {
			valueQuantity: {
				value: +visus,
				system: "https://imi-ms.github.io/eyematics-kds/CodeSystem-vs-units.html#vs-units-VAS",
				code: "Decimal",
			},
		};
	}

	// ratio -> valueRatio
	if (visus.includes("/")) {
		let ratio = visus.split("/");
		return {
			valueRatio: {
				numerator: { value: +ratio[0] },
				denominator: { value: +ratio[1] },
			},
		};
	}

	// category -> valueCodeableConcept
	if (visus in VisusCategories) {
		return { valueCodeableConcept: { coding: VisusCategories[visus] } };
	}

	// unknown visus
	throw new TypeError(`Der folgende Wert für den Visus ist ungültig: ${visus}`);
}

function getCorrectionMethod(
	correctionMethod: CorrectionMethod,
	leftEye: boolean,
	lens?: { sphere: number; cylinder: number; axis: number }
): ObservationComponentArgs {
	let position = leftEye ? [loinc("29074-2", "Left Eye position")] : [loinc("29073-4", "Right Eye position")];

	// uncorrected
	if (correctionMethod === CorrectionMethod.Uncorrected) {
		return {
			code: {
				coding: position,
			},
			valueCodeableConcept: {
				coding: CorrectionMethod2Fhir[correctionMethod],
			},
		};
	}

	// corrected with extension for lenses
	return {
		extension: [
			{
				extension: [
					{
						url: "type",
						valueCodeableConcept: {
							coding: CorrectionMethod2Fhir[correctionMethod],
						},
					},
					{
						url: "sphere",
						valueDecimal: lens.sphere,
					},
					{
						url: "cylinder",
						valueDecimal: lens.cylinder,
					},
					{
						url: "axis",
						valueDecimal: lens.axis,
					},
				],
				url: "https://larfuma.github.io/fhir-eyecare-ig/StructureDefinition/LensDuringVATestSpecification",
			},
		],
		code: {
			coding: position,
		},
		valueCodeableConcept: {
			coding: CorrectionMethod2Fhir[correctionMethod],
		},
	};
}
