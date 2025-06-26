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
	Initial = "Loading-Phase",
	Fixed = "Fixed Interval",
	PRN = "Pro Re Nata",
	TE = "Treat-and-Extend",
}

export interface IVIData {
	recordedDate: string;
	rightEye: {
		medication: IVIMedication;
		regimen: IVIRegimen;
		visus: boolean;
		appointments: number[];
		note: string;
	};
	leftEye: {
		medication: IVIMedication;
		regimen: IVIRegimen;
		visus: boolean;
		appointments: number[];
		note: string;
	};
}
