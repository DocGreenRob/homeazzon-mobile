import { ILotDto } from "./ILotDto";

export interface IDevelopmentLotsDto {
	Id: number;
	Name: string;
	Url: string;
	ContentType: string;
	Lots: Array<ILotDto>;
}