import { IUserTypeDto } from "./IUserTypeDto";
import { ICustomerDto } from "./ICustomerDto";
import { IProfileDto } from "./IProfileDto";


export interface IPropertyDesignDto {
    City: string;
    Customer: ICustomerDto;
    Id: number;
    IsDefault: boolean;
    IsProxy: boolean;
    Name: string;
    Profiles: Array<IProfileDto>;
    ProxyPropertyId: number;
    SqFt: string;
    State: string;
    StreetAddress1: string;
    StreetAddress2: string;
    TotalStories: number;
    Type: IUserTypeDto;
    UserId: number;
    UserTypeId: number;
    Zip: string;
}
