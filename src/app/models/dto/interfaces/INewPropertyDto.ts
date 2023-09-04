import { IProfile } from "./IProfile";

export interface INewPropertyDto {
    Id: number;
    Name: string;
    City: string;
    Customer: {
        Id: number;
        Name: string;
        Email: string;
    };
    IsDefault: boolean;
    IsProxy: boolean;
    SqFt: number;
    State: string;
    StreetAddress1: string;
    TotalStories: number;
    UserTypeId: number;
    Profiles: Array<IProfile>;
}
