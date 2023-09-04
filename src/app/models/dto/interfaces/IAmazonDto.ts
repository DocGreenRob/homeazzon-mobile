
import { AssetInfoDto } from '../AssetInfoDto';

export interface IAmazonDto {
	Id: number;
	Name: string;
	AssetId: number;
	AssetInfo: AssetInfoDto;
	Description: string;
	Image: string;
	Link: string;
	Price: number;
	IsMetattach: boolean;
	IsMy: boolean;
	IsSuggest: boolean;
	IsWishlist: boolean;
	Type: string;
	ArtifactIndexId: number;
}

