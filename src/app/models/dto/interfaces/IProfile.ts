import { IProfileItem } from "./IProfileItem";
import { IArea } from "./IArea";
export interface IProfile {
    Area: IArea;
    Id: number;
    Quantity: number;
    ProfileItems: Array<IProfileItem>;
}
