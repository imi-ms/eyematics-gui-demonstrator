export enum CorrectionMethod {
	Uncorrected = "Uncorrected visual acuity",
	Glasses = "Eye glasses, device",
	Lenses = "Contact lenses, device",
	Pinhole = "Pinhole Occluder",
	TLAuto = "trial-lenses-autorefraction",
	TLNoCycloplegia = "trial-lenses-manifest-without-cycloplegia",
	TLCycloplegia = "trial-lenses-manifest-with-cycloplegia",
	TLRetinoscopy = "trial-lenses-retinoscopy",
	TLNoOrigin = "trial-lenses-unspecified-origin",
}

export enum TestDistance {
	Near = "Near",
	Far = "Far",
	Intermediate = "Intermediate",
	// NotApplicable = "Not applicable",
	// Unknown = "Unknown/Indeterminate",
}

export enum Optotype {
	Landolt = "Landolt C",
	Sjogren = "Sjogren's Hand Test",
	Lea = "Lea Symbol Test",
	ETest = "E test",
	Kay = "Kay picture test",
	Cambrige = "Cambridge crowded letter charts",
	Sonsken = "Sonsken charts",
	Sheridan = "Sheridan Gardiner test",
	Stycar = "Stycar vision test",
	Cardiff = "Cardiff acuity cards",
	Teller = "Teller acuity cards",
	Keeler = "Keeler acuity cards",
	Chart = "Treatment chart",
	Allen = "Allen figure",
	HOTV = "HOTV",
	Numbers = "Numbers",
	Snellen = "Snellen",
	// NotRecorded = "Not recorded",
	// Unknown = "Unknown",
}

export interface VisusData {
	recordedDate: string;
	correctionMethod: CorrectionMethod;
	testDistance: TestDistance;
	optotype: Optotype;
	rightEye: {
		lens: {
			sphere: number;
			cylinder: number;
			axis: number;
		};
		visus: string;
	};
	leftEye: {
		lens: {
			sphere: number;
			cylinder: number;
			axis: number;
		};
		visus: string;
	};
}
