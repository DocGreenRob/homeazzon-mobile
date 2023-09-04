import { IUserDto } from './dto/interfaces/IUserDto';
import { FeatureDto } from './dto/FeatureDto';
import { IUserTypeDto } from './dto/interfaces/IUserTypeDto';

// TODO: Determine if I'm going to use concrete Types or Interfaces
export class User implements IUserDto {
	Id: number;
	IsAdmin: boolean;
	Name: string; // TODO: What is this for?
	Email: string;
	UserName: string;
	Types: Array<IUserTypeDto>;
	FirstName: string;
	LastName: string;
	FullName: string;
	IsPrivateLabelUser: boolean;
	IsPrivateLabelPartner: boolean;
	PrivateLabeler: {
		Id: number;
		User: {
			Id: number;
			Email: string;
		};
		UserTypeId: number;
		CompanyName?: string;
	};
	IsViewAsNonAdmin: boolean;
	Subscriptions: Array<FeatureDto>;
	Provider: string;
	ProviderUniqueId: string;
}