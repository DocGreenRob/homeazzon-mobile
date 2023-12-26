import { IAreaDto } from "./IAreaDto";
import { IProfileItemDto } from "./IProfileItemDto";
import { IPropertyDesignDto } from "./IPropertyDesignDto";


export interface IProfileDto {
    Area: IAreaDto;
    Data: Array<any>;
    Id: number;
    ProfileItems: Array<IProfileItemDto>;
    Property: IPropertyDesignDto;
    Quantity: number;
}
