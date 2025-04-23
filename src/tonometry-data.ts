export enum IOPMethod {
	Applanation = "Applanation tonometry",
	Pneumatic = "Pneumatic tonometry",
	Extended = "Extended tonometry",
	ExtendedOffice = "Extended tonometry - office hours",
	Extended24 = "Extended tonometry - 24 hours",
	Schiotz = "Schiotz tonometry (procedure)",
	NonContact = "Non-contact tonometry (procedure)",
	Perkins = "Perkins applanation tonometry (procedure)",
	Glodmann = "Goldmann applanation tonometry (procedure)",
	Indentation = "Indentation tonometry (procedure)",
	Rebound = "Rebound tonometry (procedure)",
	Mackay = "Mackay-Marg tonometry",
	Dynamic = "Dynamic contour tonometry (procedure)",
	Corneal = "Corneal compensated tonometry using ocular response analyzer (procedure)",
	Ocular = "Ocular response analyzer tonometry - Goldmann-correlated",
	Digital = "Digital tonometry",
	Portable = "Portable electronic applanation tonometry (procedure)",
	ReboundRemote = "Rebound tonometry remote",
	Contact = "Contact lens tonometry",
}

export interface TonometrieData {
	iopMethod: IOPMethod;
	recordedDate: string;
	rightEye: {
		pressure: number;
		mydriasis: boolean;
	};
	leftEye: {
		pressure: number;
		mydriasis: boolean;
	};
}
