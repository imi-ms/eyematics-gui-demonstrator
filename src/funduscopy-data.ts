export enum PresenceStatus {
	Present = "Present",
	Absent = "Absent",
	Unknown = "Unknown",
}

export interface FunduscopyData {
	recordedDate: string;
	rightEye: {
		papillEdema: PresenceStatus;
		macularEdema: PresenceStatus;
		vascuitis: PresenceStatus;
		note: string;
	};
	leftEye: {
		papillEdema: PresenceStatus;
		macularEdema: PresenceStatus;
		vascuitis: PresenceStatus;
		note: string;
	};
}
