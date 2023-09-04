import { IUserDto } from "./IUserDto";
import { IRoomTypeDto } from "./IRoomTypeDto";

export interface IRoomTypesDto_Patch extends IUserDto {
	PropertyId: number;
	Rooms: Array<IRoomTypeDto>;
}