import { IViewDto } from "src/app/models/dto/interfaces/IViewDto";
import { ISuite16CategoryDto } from "src/app/models/dto/interfaces/ISuite16Category";

export interface ILineitemDto {
	Id: number;
	Name: string;
	IconPath?: string;
	IsOptional?: boolean;
	IsRequired?: boolean;
	IsForDesign?: boolean;
	IsForDigiDoc?: boolean;
	IsDisplay?: boolean;
	IsDoRequireUserAction?: boolean;
	IsView?: boolean;
	View?: IViewDto;
	DigiDocCount?: number;
	WishlistCount?: number;
	SuggestCount?: number;
	Suite16Categories?: Array<ISuite16CategoryDto>;
	IsUserDefined?: boolean;

	// for UI
	IsChecked?: boolean;

}

