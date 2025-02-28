import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { CorrectionMethod, Optotype, VisusData } from "./VisusData.ts";
import { snomed, loinc } from "./tonometry-to-fhir.ts";
import { ObservationArgs, ObservationComponentArgs } from "@fhir-typescript/r4b-core/dist/fhir";

const VisusCategories = {
	FZ: [loinc("LA24679-5", "Count fingers (CF)")],
	HBW: [snomed("260295004", "Sees hand movements (finding)")],
	LS: [snomed("260296003", "Perceives light only (finding)")],
	NL: [snomed("63063006", "Visual acuity, no light perception (finding)")],
};

const CorrectionMethod2Fhir = {
	Uncorrected: [snomed("420050001", "Uncorrected visual acuity")],
	Glasses: [snomed("50121007", "Eye glasses, device")],
	Lenses: [snomed("57368009", "Contact lenses, device")],
	Pinhole: [snomed("257492003", "Pinhole Occluder")],
	TLAuto: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-autorefraction",
			display: "",
		},
	],
	TLNoCycloplegia: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-manifest-without-cycloplegia",
			display: "",
		},
	],
	TLCycloplegia: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-manifest-with-cycloplegia",
			display: "",
		},
	],
	TLRetinoscopy: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-retinoscopy",
			display: "",
		},
	],
	TLNoOrigin: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/vs-va-correction-methods",
			code: "trial-lenses-unspecified-origin",
			display: "",
		},
	],
};

const TestDistance2Fhir = {
	Near: [loinc("LA32578-9", "Near")],
	Far: [loinc("LA32577-1", "Far")],
	Intermediate: [loinc("LA16550-8", "Intermediate")],
	// NotApplicable: [loinc("LA4720-4", "Not applicable")],
	// Unknown: [loinc("LA13420-7", "Unknown/Indeterminate")],
};

const Optotype2Fhir = {
	Landolt: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/va-optotypes",
			code: "LandoltC",
			display: "", // "Landolt C",
		},
	],
	Sjogren: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/va-optotypes",
			code: "Sjogren",
			display: "", // "Sjogren's Hand Test",
		},
	],
	Lea: [
		{
			system: "https://eyematics.org/fhir/eyematics-kds/CodeSystem/va-optotypes",
			code: "Lea",
			display: "", // "Lea Symbol Test",
		},
	],
	ETest: [snomed("400911007", "E test (procedure)")],
	Kay: [snomed("252982005", "Kay picture test")],
	Cambrige: [snomed("252977003", "Cambridge crowded letter charts")],
	Sonsken: [snomed("252976007", "Sonsken charts")],
	Sheridan: [snomed("252978008", "Sheridan Gardiner test")],
	Stycar: [snomed("252884005", "Stycar vision test")],
	Cardiff: [snomed("285805006", "Cardiff acuity cards")],
	Teller: [snomed("285803004", "Teller acuity cards"), loinc("LA25494-8", "Teller")],
	Keeler: [snomed("285804005", "Keeler acuity cards")],
	Chart: [snomed("400914004", "Early Treatment of Diabetic Retinopathy Study visual acuity chart (physical object)")],
	Allen: [loinc("LA25495-5", "Allen figure")],
	HOTV: [loinc("LA25496-3", "HOTV")],
	Numbers: [loinc("LA25497-1", "Numbers")],
	Snellen: [loinc("LA25498-9", "Snellen")],
	// NotRecorded: [snomed("1220561009", "Not recorded")],
	// Unknown: [snomed("261665006", "Unknown")],
};

export function visus2Fhir(data: VisusData): Observation[] {
	let left = new Observation({
		resourceType: "Observation",
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("260246004", "Visual Acuity finding")],
		},
		effectiveDateTime: data.recordedDate,
		...getVisusValue(data.leftEye.visus),
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
		...getVisusMethod(data.optotype),
		component: [
			getCorrectionMethod(data.correctionMethod, true, data.leftEye.lens),
			{
				id: "Test-Distance",
				code: {
					coding: [snomed("252124009", "Test distance")],
				},
				valueCodeableConcept: {
					coding: TestDistance2Fhir[data.testDistance],
				},
			},
			{
				id: "Optotype-used",
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
		],
	});

	let right = new Observation({
		resourceType: "Observation",
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("260246004", "Visual Acuity finding")],
		},
		effectiveDateTime: data.recordedDate,
		...getVisusValue(data.rightEye.visus),
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
		...getVisusMethod(data.optotype),
		component: [
			getCorrectionMethod(data.correctionMethod, false, data.rightEye.lens),
			{
				id: "Test-Distance",
				code: {
					coding: [snomed("252124009", "Test distance")],
				},
				valueCodeableConcept: {
					coding: TestDistance2Fhir[data.testDistance],
				},
			},
			{
				id: "Optotype-used",
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
		],
	});

	return [left.toJSON(), right.toJSON()];
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

function getVisusMethod(optotype: Optotype): Partial<ObservationArgs> {
	const Optotyp2Method = {
		Snellen: [snomed("400913005", "Snellen chart (physical object)")],
		Chart: [snomed("400914004", "ETDRS visual acuity chart")],
		Allen: [snomed("400915003", "Allen cards (physical object)")],
		HOTV: [snomed("400916002", "HOTV cards (physical object)")],
		// ?: [snomed("416307006", "Laser inferometer for potential acuity testing (physical object)")],
		// ?: [snomed("417283003", "Potential acuity meter (physical object)")],
		// ?: [snomed("418295001", "Near card (physical object)")],
		// ?: [snomed("418570001", "Accommodative rule (physical object)")],
		// ?: [snomed("421763006", "Visual acuity chart (physical object)")],
	};

	return {
		method: {
			coding:
				optotype in Optotyp2Method
					? Optotyp2Method[optotype]
					: [snomed("421763006", "Visual acuity chart (physical object)")],
		},
	};
}

function getCorrectionMethod(
	correctionMethod: CorrectionMethod,
	leftEye: boolean,
	lens?: { sphere: number; cylinder: number; axis: number }
): ObservationComponentArgs {
	let bodySite = leftEye ? "left" : "right";
	let position = leftEye ? [loinc("29074-2", "Left Eye position")] : [loinc("29073-4", "Right Eye position")];

	// uncorrected
	if (
		CorrectionMethod[correctionMethod] === CorrectionMethod.Uncorrected ||
		CorrectionMethod[correctionMethod] === CorrectionMethod.Pinhole
	) {
		return {
			id: `Correction-${bodySite}-eye`,
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
		id: `Correction-${bodySite}-eye`,
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
