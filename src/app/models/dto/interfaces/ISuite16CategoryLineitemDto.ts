import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";

export interface ISuite16CategoryLineitemDto {
	Id: number;
	Name: string;
	Lineitems?: Array<ILineitemDto>;
}