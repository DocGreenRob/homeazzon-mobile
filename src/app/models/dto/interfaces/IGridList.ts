import { IGridListItem } from "./IGridListItem";
import { IDynamicViewResultGridListItem } from "./IDynamicViewResultGridListItem";

export interface IGridList {
	Name: string;
	Items: Array<IGridListItem>;
	ViewResultItems?: Array<IDynamicViewResultGridListItem>;
}
