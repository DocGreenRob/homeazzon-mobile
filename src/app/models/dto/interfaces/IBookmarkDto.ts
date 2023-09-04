import { IAssetInfoDto } from "./IAssetInfoDto";
import { AssetIndexDto } from "./AssetIndexDto";

export interface IBookmarkDto {
	Id: number;
	Url: string;
	AssetInfo?: IAssetInfoDto;
	Index?: AssetIndexDto;
	IsUnopenedSuggestion?: boolean;
}
