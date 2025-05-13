export enum IVIMedication {
	Af2 = "Aflibercept 2 mg",
	Af8 = "Aflibercept 8 mg",
	Be = "Bevacizumab",
	Br = "Brolucizumab",
	Fa = "Faricimab",
	Ra = "Ranibizumab",
	De = "Dexamethason",
	Oc = "Ocriplasmin",
}

export enum IVIRegimen {
	Fixed = "Fixed Interval",
	PRN = "Pro Re Nata",
	TE = "Treat-and-Extend",
}

export interface IVIData {
	recordedDate: string;
	rightEye: {
		medication: IVIMedication;
		treatment: {
			regimen: IVIRegimen;
			min: number;
			max: number;
		};
		note: string;
	};
	leftEye: {
		medication: IVIMedication;
		treatment: {
			regimen: IVIRegimen;
			min: number;
			max: number;
		};
		note: string;
	};
}
