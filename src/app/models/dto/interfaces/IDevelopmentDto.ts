import { ILotDto } from "./ILotDto";
import { IFireBase } from "./IFireBase";

export interface IDevelopmentDto extends IFireBase {
	Id?: number;
	Lots?: Array<ILotDto>;
	//patch
	PropertyId?: number;
	Developments?: Array<IDevelopmentDto>;
}