import { IPrivateLabelerDto_Get } from "./IPrivateLabelerDto_Get";
import { IUserTypeDto } from "./IUserTypeDto";

export interface IUserDto_Get {
	Id?: number;
	Name?: string;
	Email?: string;
	IsPrivateLabelUser?: number;
	IsPrivateLabelPartner?: number;
	Types?: Array<any>;
	UserName?: number;
	PrivateLabeler?: IPrivateLabelerDto_Get;
	UserType?: IUserTypeDto;
	UserId?: number;
	CurrentUser?: string;
}
