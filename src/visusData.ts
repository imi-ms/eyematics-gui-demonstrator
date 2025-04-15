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
	Allen = "Allen figure",
	Cambrige = "Cambridge crowded letter charts",
	Cardiff = "Cardiff acuity cards",
	ETest = "E test",
	HOTV = "HOTV",
	Kay = "Kay picture test",
	Keeler = "Keeler acuity cards",
	Lea = "Lea Symbol Test",
	Sheridan = "Sheridan Gardiner test",
	Sjogren = "Sjogren's Hand Test",
	Sonsken = "Sonsken charts",
	Stycar = "Stycar vision test",
	Teller = "Teller acuity cards",
	Chart = "Treatment chart",
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
		mydriasis: boolean;
		pinhole: boolean;
	};
	leftEye: {
		lens: {
			sphere: number;
			cylinder: number;
			axis: number;
		};
		visus: string;
		mydriasis: boolean;
		pinhole: boolean;
	};
}
