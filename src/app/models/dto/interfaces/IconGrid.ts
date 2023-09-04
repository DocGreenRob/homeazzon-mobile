import { IGridList } from "./IGridList";
import { IGrid } from "./IGrid";

export interface IconGrid extends IGrid {
	Lists: Array<IGridList>;
}
