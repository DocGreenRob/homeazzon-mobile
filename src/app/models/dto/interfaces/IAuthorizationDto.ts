import { ICompanyInformationDto } from "./ICompanyInformationDto";
import { IUserDto } from "./IUserDto";
import { IPropertyDesignDto } from "./IPropertyDesignDto";


export interface IAuthorizationDto {
    Company: ICompanyInformationDto;
    CustomerId: number;
    Guid: string;
    Id: number;
    PropertyId: number;
    ProxyPropertyId: number;
    RequestDate: string;
    Type: string;
    UserId: number;
    UserTypeId: number;
    Property: IPropertyDesignDto;
    Sender: IUserDto;
}
