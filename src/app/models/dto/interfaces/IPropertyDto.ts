import { IRoomTypeDto } from "./IRoomTypeDto";
import { IImageDto } from "./IImageDto";
import { IDevelopmentDto } from "./IDevelopmentDto";
import { ILinkDto } from "./ILinkDto";
import { IUserDto } from './IUserDto';
import { IAddressDto } from './IAddressDto';

export interface IPropertyDto {
	Id: number;
	Name: string;
	Address?: IAddressDto;
	TotalStories?: number;
	SqFt: number;
	Bedrooms: Array<IRoomTypeDto>;
	Bathrooms: Array<IRoomTypeDto>;
	InteriorAreas: Array<IRoomTypeDto>;
	ExteriorAreas: Array<IRoomTypeDto>;
	Images: Array<IImageDto>;
	Links: Array<ILinkDto>;
	Developments: Array<IDevelopmentDto>;
	CurrentUser?: string;
	UserId?: number;
	IsProxy?: boolean;
	IsMy?: boolean;
	IsWishlist?: boolean;
	IsSuggested?: boolean;
	User?: IUserDto;
	UserTypeId: number;
}