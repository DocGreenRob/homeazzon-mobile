import { IUserDto_Get } from "./IUserDto_Get";

export interface ILotDto extends IUserDto_Get {
	Id: number;
	DevelopmentId: number;
	Price: number;
	LotNumber: string;
	StreetAddress1: string;
	City: string;
	State: string;
	Zip: number;
	ParcelNumber: string;
	LegalDescriptionNumber: string;
	LotSize: number;
	LotPlanUrl: string;
	LotPlanUrlContentType: string;
	WaterSource: string;
	WaterTapHookupFee: number;
	WellApproximateDepth: string;
	WellApproximateCost: number;
	IsWasteWaterSewerAndTap: boolean;
	WasteWaterSewerAndTapEstimateCost: number;
	IsWasteWaterSepticSystem: boolean;
	WasteWaterSepticSystemDoseTanksEstimatedCost: number;
	WasteWaterSepticSystemDrainFieldEstimatedCost: number;
	IsPowerElectricalHookup: boolean;
	IsPowerElectricalPowerlinesSupplied: boolean;
	PowerElectricalTrenchingEstimateCost: number;
	PowerElectricalPermitEstimatedCost: number;
	PowerElectricalTemporaryUtilitiesEstimatedCost: number;
	IsPowerOffGrid: boolean;
	PowerOffGridEstimatedCost: number;
	IsCable: boolean;
}