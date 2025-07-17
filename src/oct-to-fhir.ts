import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { snomed, loinc } from "./tonometry-to-fhir.ts";

import { ObservationStatusCodes } from "@fhir-typescript/r4b-core/dist/fhirValueSets/ObservationStatusCodes";
import { Bundle, BundleEntry, Device, ImagingStudy, Reference } from "@fhir-typescript/r4b-core/dist/fhir";
import { MacularMap, OCTData, RNFLMap } from "./oct-data.ts";

const MacularMap2Fhir = {
	[MacularMap.CenterPoint]: [loinc("57108-3", "Macular grid.center point thickness by OCT")],
	[MacularMap.CenterSub]: [loinc("57109-1", "Macular grid.center subfield thickness by OCT")],
	[MacularMap.InnerSup]: [loinc("57110-9", "Macular grid.inner superior subfield thickness by OCT")],
	[MacularMap.InnerNasal]: [loinc("57111-7", "Macular grid.inner nasal subfield thickness by OCT")],
	[MacularMap.InnerInf]: [loinc("57112-5", "Macular grid.inner inferior subfield thickness by OCT")],
	[MacularMap.InnerTemp]: [loinc("57113-3", "Macular grid.inner temporal subfield thickness by OCT")],
	[MacularMap.OuterSup]: [loinc("57114-1", "Macular grid.outer superior subfield thickness by OCT")],
	[MacularMap.OuterNasal]: [loinc("57115-8", "Macular grid.outer nasal subfield thickness by OCT")],
	[MacularMap.OuterInf]: [loinc("57116-6", "Macular grid.outer inferior subfield thickness by OCT")],
	[MacularMap.OuterTemp]: [loinc("57117-4", "Macular grid.outer temporal subfield thickness by OCT")],
	[MacularMap.TotalVol]: [loinc("57118-2", "Macular grid.total volume by OCT")],
};

const RNFLMap2Fhir = {
	[RNFLMap.RInfTemp]: [loinc("86287-0", "Right retina Retinal nerve fiber layer.inferior temporal thickness by OCT")],
	[RNFLMap.RInf]: [loinc("86283-9", "Right retina Retinal nerve fiber layer.inferior thickness by OCT")],
	[RNFLMap.RMean]: [loinc("86301-9", "Right retina Retinal nerve fiber layer.mean thickness by OCT")],
	[RNFLMap.RNasalInf]: [loinc("86282-1", "Right retina Retinal nerve fiber layer.nasal inferior thickness by OCT")],
	[RNFLMap.RNasalSup]: [loinc("86280-5", "Right retina Retinal nerve fiber layer.nasal superior thickness by OCT")],
	[RNFLMap.RNasal]: [loinc("86284-7", "Right retina Retinal nerve fiber layer.nasal thickness by OCT")],
	[RNFLMap.RSup]: [loinc("86276-3", "Right retina Retinal nerve fiber layer.superior thickness by OCT")],
	[RNFLMap.RTempSup]: [loinc("86274-8", "Right retina Retinal nerve fiber layer.temporal superior thickness by OCT")],
	[RNFLMap.RTemp]: [loinc("86273-0", "Right retina Retinal nerve fiber layer.temporal thickness by OCT")],
	[RNFLMap.RClock1]: [loinc("86305-0", "Right retina Retinal nerve fiber layer.clock hour 1 thickness by OCT")],
	[RNFLMap.RClock2]: [loinc("86306-8", "Right retina Retinal nerve fiber layer.clock hour 2 thickness by OCT")],
	[RNFLMap.RClock3]: [loinc("86307-6", "Right retina Retinal nerve fiber layer.clock hour 3 thickness by OCT")],
	[RNFLMap.RClock4]: [loinc("86308-4", "Right retina Retinal nerve fiber layer.clock hour 4 thickness by OCT")],
	[RNFLMap.RClock5]: [loinc("86309-2", "Right retina Retinal nerve fiber layer.clock hour 5 thickness by OCT")],
	[RNFLMap.RClock6]: [loinc("86310-0", "Right retina Retinal nerve fiber layer.clock hour 6 thickness by OCT")],
	[RNFLMap.RClock7]: [loinc("86311-8", "Right retina Retinal nerve fiber layer.clock hour 7 thickness by OCT")],
	[RNFLMap.RClock8]: [loinc("86312-6", "Right retina Retinal nerve fiber layer.clock hour 8 thickness by OCT")],
	[RNFLMap.RClock9]: [loinc("86313-4", "Right retina Retinal nerve fiber layer.clock hour 9 thickness by OCT")],
	[RNFLMap.RClock10]: [loinc("86314-2", "Right retina Retinal nerve fiber layer.clock hour 10 thickness by OCT")],
	[RNFLMap.RClock11]: [loinc("86315-9", "Right retina Retinal nerve fiber layer.clock hour 11 thickness by OCT")],
	[RNFLMap.RClock12]: [loinc("86304-3", "Right retina Retinal nerve fiber layer.clock hour 12 thickness by OCT")],
	[RNFLMap.LInfTemp]: [loinc("86289-6", "Left retina Retinal nerve fiber layer.inferior temporal thickness by OCT")],
	[RNFLMap.LInf]: [loinc("86288-8", "Left retina Retinal nerve fiber layer.inferior thickness by OCT")],
	[RNFLMap.LMean]: [loinc("86290-4", "Left retina Retinal nerve fiber layer.mean thickness by OCT")],
	[RNFLMap.LNasalInf]: [loinc("86272-2", "Left retina Retinal nerve fiber layer.nasal inferior thickness by OCT")],
	[RNFLMap.LNasalSup]: [loinc("86281-3", "Left retina Retinal nerve fiber layer.nasal superior thickness by OCT")],
	[RNFLMap.LNasal]: [loinc("86279-7", "Left retina Retinal nerve fiber layer.nasal thickness by OCT")],
	[RNFLMap.LSup]: [loinc("86277-1", "Left retina Retinal nerve fiber layer.superior thickness by OCT")],
	[RNFLMap.LTempSup]: [loinc("86275-5", "Left retina Retinal nerve fiber layer.temporal superior thickness by OCT")],
	[RNFLMap.LTemp]: [loinc("86278-9", "Left retina Retinal nerve fiber layer.temporal thickness by OCT")],
	[RNFLMap.LClock1]: [loinc("86293-8", "Left retina Retinal nerve fiber layer.clock hour 1 thickness by OCT")],
	[RNFLMap.LClock2]: [loinc("86294-6", "Left retina Retinal nerve fiber layer.clock hour 2 thickness by OCT")],
	[RNFLMap.LClock3]: [loinc("86295-3", "Left retina Retinal nerve fiber layer.clock hour 3 thickness by OCT")],
	[RNFLMap.LClock4]: [loinc("86296-1", "Left retina Retinal nerve fiber layer.clock hour 4 thickness by OCT")],
	[RNFLMap.LClock5]: [loinc("86297-9", "Left retina Retinal nerve fiber layer.clock hour 5 thickness by OCT")],
	[RNFLMap.LClock6]: [loinc("86298-7", "Left retina Retinal nerve fiber layer.clock hour 6 thickness by OCT")],
	[RNFLMap.LClock7]: [loinc("86299-5", "Left retina Retinal nerve fiber layer.clock hour 7 thickness by OCT")],
	[RNFLMap.LClock8]: [loinc("86300-1", "Left retina Retinal nerve fiber layer.clock hour 8 thickness by OCT")],
	[RNFLMap.LClock9]: [loinc("86286-2", "Left retina Retinal nerve fiber layer.clock hour 9 thickness by OCT")],
	[RNFLMap.LClock10]: [loinc("86302-7", "Left retina Retinal nerve fiber layer.clock hour 10 thickness by OCT")],
	[RNFLMap.LClock11]: [loinc("86303-5", "Left retina Retinal nerve fiber layer.clock hour 11 thickness by OCT")],
	[RNFLMap.LClock12]: [loinc("86292-0", "Left retina Retinal nerve fiber layer.clock hour 12 thickness by OCT")],
};

export function oct2Fhir(data: OCTData): Bundle[] {
	let retinalThicknessLeft = new Observation({
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: MacularMap2Fhir[data.leftEye.retinalThickness.position],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.leftEye.retinalThickness.value,
			unit: "µm",
			system: "http://unitsofmeasure.org",
			code: "um",
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let opticDiscDiameterLeft = new Observation({
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("392158006", "Vertical diameter of optic disc (observable entity)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.leftEye.opticDiscDiameter.value,
			unit: "mm",
			system: "http://unitsofmeasure.org",
			code: "mm",
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let rnflThicknessLeft = new Observation({
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: RNFLMap2Fhir[data.leftEye.rnflThickness.position],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.leftEye.rnflThickness.value,
			unit: "µm",
			system: "http://unitsofmeasure.org",
			code: "um",
		},
		bodySite: {
			coding: [snomed("1290041000", "Entire left eye proper (body structure)")],
		},
	});

	let imagingStudyLeft = null,
		deviceLeft = null;

	// add optional ImagingStudy Reference
	if (data.leftEye.dicomData.url) {
		let imagingStudyIDLeft = `image-left-${data.leftEye.dicomData.url?.toLowerCase()}`;

		retinalThicknessLeft.derivedFrom =
			opticDiscDiameterLeft.derivedFrom =
			rnflThicknessLeft.derivedFrom =
				[
					new Reference({
						reference: `ImagingStudy/${imagingStudyIDLeft}`,
						display: "OCT Image Resource Left",
					}),
				];

		imagingStudyLeft = new ImagingStudy({
			id: imagingStudyIDLeft,
			status: ObservationStatusCodes.Final,
			description: "OCT scan image for analysis of left eye",
			endpoint: [
				{
					reference: "Endpoint/local-dicom-endpoint",
					display: "Local DICOM File Access",
				},
			],
		});
	}

	// add optional Device Reference
	if (
		data.leftEye.dicomData.manufacturer &&
		data.leftEye.dicomData.modelName &&
		data.leftEye.dicomData.softwareVersions
	) {
		let deviceIDLeft = `device-left-${data.leftEye.dicomData.modelName?.toLowerCase()}`;

		retinalThicknessLeft.device =
			opticDiscDiameterLeft.device =
			rnflThicknessLeft.device =
				new Reference({
					reference: `Device/${deviceIDLeft}`,
					display: "OCT Device Resource Left",
				});

		deviceLeft = new Device({
			id: deviceIDLeft,
			status: ObservationStatusCodes.Final,
			manufacturer: data.leftEye.dicomData.manufacturer,
			deviceName: [
				{
					name: data.leftEye.dicomData.modelName,
					type: "model-name",
				},
			],
			version: [
				{
					type: {
						text: "software",
					},
					value: data.leftEye.dicomData.softwareVersions,
				},
			],
		});
	}

	let left = new Bundle({
		type: "collection",
		entry: [
			{ resource: retinalThicknessLeft },
			{ resource: opticDiscDiameterLeft },
			{ resource: rnflThicknessLeft },
		],
	});

	// add optional ImagingStudy to bundle
	if (imagingStudyLeft) {
		left.entry.push(new BundleEntry({ resource: imagingStudyLeft }));
	}

	// add optional Device to bundle
	if (deviceLeft) {
		left.entry.push(new BundleEntry({ resource: deviceLeft }));
	}

	let retinalThicknessRight = new Observation({
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: MacularMap2Fhir[data.rightEye.retinalThickness.position],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.rightEye.retinalThickness.value,
			unit: "µm",
			system: "http://unitsofmeasure.org",
			code: "um",
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let opticDiscDiameterRight = new Observation({
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: [snomed("392158006", "Vertical diameter of optic disc (observable entity)")],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.rightEye.opticDiscDiameter.value,
			unit: "mm",
			system: "http://unitsofmeasure.org",
			code: "mm",
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let rnflThicknessRight = new Observation({
		status: ObservationStatusCodes.Final,
		category: [
			{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" }] },
		],
		code: {
			coding: RNFLMap2Fhir[data.rightEye.rnflThickness.position],
		},
		effectiveDateTime: new Date(data.recordedDate).toISOString(),
		valueQuantity: {
			value: data.rightEye.rnflThickness.value,
			unit: "µm",
			system: "http://unitsofmeasure.org",
			code: "um",
		},
		bodySite: {
			coding: [snomed("1290043002", "Entire right eye proper (body structure)")],
		},
	});

	let imagingStudyRight = null,
		deviceRight = null;

	// add optional ImagingStudy Reference
	if (data.rightEye.dicomData.url) {
		let imagingStudyIDRight = `image-right-${data.rightEye.dicomData.url?.toLowerCase()}`;

		retinalThicknessRight.derivedFrom =
			opticDiscDiameterRight.derivedFrom =
			rnflThicknessRight.derivedFrom =
				[
					new Reference({
						reference: `ImagingStudy/${imagingStudyIDRight}`,
						display: "OCT Image Resource Right",
					}),
				];

		imagingStudyRight = new ImagingStudy({
			id: imagingStudyIDRight,
			status: ObservationStatusCodes.Final,
			description: "OCT scan image for analysis of right eye",
			endpoint: [
				{
					reference: "Endpoint/local-dicom-endpoint",
					display: "Local DICOM File Access",
				},
			],
		});
	}

	// add optional Device Reference
	if (
		data.rightEye.dicomData.manufacturer &&
		data.rightEye.dicomData.modelName &&
		data.rightEye.dicomData.softwareVersions
	) {
		let deviceIDRight = `device-right-${data.rightEye.dicomData.modelName?.toLowerCase()}`;

		retinalThicknessRight.device =
			opticDiscDiameterRight.device =
			rnflThicknessRight.device =
				new Reference({
					reference: `Device/${deviceIDRight}`,
					display: "OCT Device Resource Right",
				});

		deviceRight = new Device({
			id: deviceIDRight,
			status: ObservationStatusCodes.Final,
			manufacturer: data.rightEye.dicomData.manufacturer,
			deviceName: [
				{
					name: data.rightEye.dicomData.modelName,
					type: "model-name",
				},
			],
			version: [
				{
					type: {
						text: "software",
					},
					value: data.rightEye.dicomData.softwareVersions,
				},
			],
		});
	}

	let right = new Bundle({
		type: "collection",
		entry: [
			{ resource: retinalThicknessRight },
			{ resource: opticDiscDiameterRight },
			{ resource: rnflThicknessRight },
		],
	});

	// add optional ImagingStudy to bundle
	if (imagingStudyRight) {
		right.entry.push(new BundleEntry({ resource: imagingStudyRight }));
	}

	// add optional Device to bundle
	if (deviceRight) {
		right.entry.push(new BundleEntry({ resource: deviceRight }));
	}

	return [left, right];
}
