import { AssetInfoDto } from '../AssetInfoDto';
import { AssetIndexDto } from './AssetIndexDto';

export class BookmarkDto {
	Id: number;
	Url: string;
	AssetInfo?: AssetInfoDto;
	Index?: AssetIndexDto;
	IsUnopenedSuggestion?: boolean;
	ArtifactIndexId: number;
}
