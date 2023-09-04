import { ILineitemDto } from "./ILineItemDto";

export interface IAreaDto {
	Id: number;
	Name?: string;
	Lineitems: Array<ILineitemDto>;
}
