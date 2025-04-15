export enum MacularMap {
	CenterPoint = "Macular grid.center point thickness by OCT",
	CenterSub = "Macular grid.center subfield thickness by OCT",
	InnerSup = "Macular grid.inner superior subfield thickness by OCT",
	InnerNasal = "Macular grid.inner nasal subfield thickness by OCT",
	InnerInf = "Macular grid.inner inferior subfield thickness by OCT",
	InnerTemp = "Macular grid.inner temporal subfield thickness by OCT",
	OuterSup = "Macular grid.outer superior subfield thickness by OCT",
	OuterNasal = "Macular grid.outer nasal subfield thickness by OCT",
	OuterInf = "Macular grid.outer inferior subfield thickness by OCT",
	OuterTemp = "Macular grid.outer temporal subfield thickness by OCT",
	TotalVol = "Macular grid.total volume by OCT",
}

export enum RNFLMap {
	RInfTemp = "Right retina Retinal nerve fiber layer.inferior temporal thickness by OCT",
	LInfTemp = "Left retina Retinal nerve fiber layer.inferior temporal thickness by OCT",
	RInf = "Right retina Retinal nerve fiber layer.inferior thickness by OCT",
	LInf = "Left retina Retinal nerve fiber layer.inferior thickness by OCT",
	LMean = "Left retina Retinal nerve fiber layer.mean thickness by OCT",
	RMean = "Right retina Retinal nerve fiber layer.mean thickness by OCT",
	LNasalInf = "Left retina Retinal nerve fiber layer.nasal inferior thickness by OCT",
	RNasalInf = "Right retina Retinal nerve fiber layer.nasal inferior thickness by OCT",
	RNasalSup = "Right retina Retinal nerve fiber layer.nasal superior thickness by OCT",
	LNasalSup = "Left retina Retinal nerve fiber layer.nasal superior thickness by OCT",
	LNasal = "Left retina Retinal nerve fiber layer.nasal thickness by OCT",
	RNasal = "Right retina Retinal nerve fiber layer.nasal thickness by OCT",
	RSup = "Right retina Retinal nerve fiber layer.superior thickness by OCT",
	LSup = "Left retina Retinal nerve fiber layer.superior thickness by OCT",
	RTempSup = "Right retina Retinal nerve fiber layer.temporal superior thickness by OCT",
	LTempSup = "Left retina Retinal nerve fiber layer.temporal superior thickness by OCT",
	RTemp = "Right retina Retinal nerve fiber layer.temporal thickness by OCT",
	LTemp = "Left retina Retinal nerve fiber layer.temporal thickness by OCT",
	LClock1 = "Left retina Retinal nerve fiber layer.clock hour 1 thickness by OCT",
	RClock1 = "Right retina Retinal nerve fiber layer.clock hour 1 thickness by OCT",
	LClock2 = "Left retina Retinal nerve fiber layer.clock hour 2 thickness by OCT",
	RClock2 = "Right retina Retinal nerve fiber layer.clock hour 2 thickness by OCT",
	LClock3 = "Left retina Retinal nerve fiber layer.clock hour 3 thickness by OCT",
	RClock3 = "Right retina Retinal nerve fiber layer.clock hour 3 thickness by OCT",
	LClock4 = "Left retina Retinal nerve fiber layer.clock hour 4 thickness by OCT",
	RClock4 = "Right retina Retinal nerve fiber layer.clock hour 4 thickness by OCT",
	LClock5 = "Left retina Retinal nerve fiber layer.clock hour 5 thickness by OCT",
	RClock5 = "Right retina Retinal nerve fiber layer.clock hour 5 thickness by OCT",
	LClock6 = "Left retina Retinal nerve fiber layer.clock hour 6 thickness by OCT",
	RClock6 = "Right retina Retinal nerve fiber layer.clock hour 6 thickness by OCT",
	LClock7 = "Left retina Retinal nerve fiber layer.clock hour 7 thickness by OCT",
	RClock7 = "Right retina Retinal nerve fiber layer.clock hour 7 thickness by OCT",
	LClock8 = "Left retina Retinal nerve fiber layer.clock hour 8 thickness by OCT",
	RClock8 = "Right retina Retinal nerve fiber layer.clock hour 8 thickness by OCT",
	LClock9 = "Left retina Retinal nerve fiber layer.clock hour 9 thickness by OCT",
	RClock9 = "Right retina Retinal nerve fiber layer.clock hour 9 thickness by OCT",
	LClock10 = "Left retina Retinal nerve fiber layer.clock hour 10 thickness by OCT",
	RClock10 = "Right retina Retinal nerve fiber layer.clock hour 10 thickness by OCT",
	LClock11 = "Left retina Retinal nerve fiber layer.clock hour 11 thickness by OCT",
	RClock11 = "Right retina Retinal nerve fiber layer.clock hour 11 thickness by OCT",
	RClock12 = "Right retina Retinal nerve fiber layer.clock hour 12 thickness by OCT",
	LClock12 = "Left retina Retinal nerve fiber layer.clock hour 12 thickness by OCT",
}

export interface OCTData {
	recordedDate: string;
	rightEye: {
		retinalThickness: {
			value: number;
			position: MacularMap;
		};
		opticDiscDiameter: {
			value: number;
		};
		rnflThickness: {
			value: number;
			position: RNFLMap;
		};
		dicomData: {
			url: string;
			manufacturer: string;
			modelName: string;
			softwareVersions: string;
		};
	};
	leftEye: {
		retinalThickness: {
			value: number;
			position: MacularMap;
		};
		opticDiscDiameter: {
			value: number;
		};
		rnflThickness: {
			value: number;
			position: RNFLMap;
		};
		dicomData: {
			url: string;
			manufacturer: string;
			modelName: string;
			softwareVersions: string;
		};
	};
}
