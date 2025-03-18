export enum CorrectionMethod {
	Uncorrected = "Uncorrected visual acuity",
	Glasses = "Eye glasses, device",
	Lenses = "Contact lenses, device",
	TLAuto = "trial-lenses-autorefraction",
	TLNoCycloplegia = "trial-lenses-manifest-without-cycloplegia",
	TLCycloplegia = "trial-lenses-manifest-with-cycloplegia",
	TLRetinoscopy = "trial-lenses-retinoscopy",
	TLNoOrigin = "trial-lenses-unspecified-origin",
}

export enum TestDistance {
	Far = "Far",
	Intermediate = "Intermediate",
	Near = "Near",
}

export enum Optotype {
	Numbers = "Numbers",
	Snellen = "Snellen",
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
		pinhole: boolean;
	};
	leftEye: {
		lens: {
			sphere: number;
			cylinder: number;
			axis: number;
		};
		visus: string;
		pinhole: boolean;
	};
}
