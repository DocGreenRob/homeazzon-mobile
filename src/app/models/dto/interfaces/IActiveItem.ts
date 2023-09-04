import { IAreaType } from "./IAreaType";
import { IAssetInfoDto } from "./IAssetInfoDto";
import { IYouTubeDto } from "./IYouTubeDto";
import { IGoogleLinkDto } from "./IGoogleLinkDto";
import { IDigiDocDto } from "./IDigiDocDto";
import { IQrCodeDto } from "./IQrCodeDto";
import { IProductDto } from "./IProductDto";
import { IAmazonDto } from "./IAmazonDto";
import { IGoogleProductDto } from "./IGoogleProductDto";
import { IBookmarkDto } from "./IBookmarkDto";

export interface IActiveItem {
	Id: number;
	Name: string;
	AssetInfo?: IAssetInfoDto;
	ArtifactIndexId?: number;
	Type: string;
	Image: string;
	IsMy: boolean;
	IsWishlist: boolean;
	IsSuggest: boolean;
	Amazon?: IAmazonDto;
	GoogleProduct?: IGoogleProductDto;
	YouTubeVideo?: IYouTubeDto;
	GoogleLink?: IGoogleLinkDto;
	DigiDoc?: IDigiDocDto;
	Product?: IProductDto;
	QrCode?: IQrCodeDto;
	Bookmark?: IBookmarkDto;
	IsUnopenedSuggestion?: boolean;
	IsProfileItemImage?: boolean;
}
