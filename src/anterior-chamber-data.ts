import { PresenceStatus } from "./funduscopy-data";

export enum SUNFlare {
	Absent = "Absent",
	One = "+",
	Two = "++",
	Three = "+++",
	Four = "++++",
}

export enum SUNCells {
	Absent = "Absent",
	Half = "(+)",
	One = "+",
	Two = "++",
	Three = "+++",
	Four = "++++",
}

export interface AnteriorChamberData {
	recordedDate: string;
	rightEye: {
		cells: SUNCells;
		flare: SUNFlare;
		synechiae: PresenceStatus;
		note: string;
	};
	leftEye: {
		cells: SUNCells;
		flare: SUNFlare;
		synechiae: PresenceStatus;
		note: string;
	};
}
