import { IUserDto_Get } from "./IUserDto_Get";
import { ILinkDto } from "./ILinkDto";

export interface ILinksDto_Patch extends IUserDto_Get {
	PropertyId: number;
	Links: Array<ILinkDto>;
}