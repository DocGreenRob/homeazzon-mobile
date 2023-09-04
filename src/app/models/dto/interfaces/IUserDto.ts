import { IUserTypeDto } from "./IUserTypeDto";
import { IFeatureDto } from './IFeatureDto';

export interface IUserDto {
	Id: number;
	IsAdmin: boolean;
	Name: string;
	Email: string;
	UserName: string;
	Types: Array<IUserTypeDto>;
	FirstName: string;
	LastName: string;
	FullName: string;
	IsPrivateLabelUser: boolean;
	IsPrivateLabelPartner: boolean;
	PrivateLabeler: {
		Id: number,
		User: {
			Id: number,
			Email: string
		},
		UserTypeId: number,
		CompanyName? : string
	};
	IsViewAsNonAdmin: boolean;
	Subscriptions: Array<IFeatureDto>;
	Provider: string;
	ProviderUniqueId: string;
}