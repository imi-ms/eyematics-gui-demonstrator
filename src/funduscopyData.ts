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
	};
	leftEye: {
		papillEdema: PresenceStatus;
		macularEdema: PresenceStatus;
		vascuitis: PresenceStatus;
	};
}
