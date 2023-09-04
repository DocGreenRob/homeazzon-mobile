
import { IAmazonDto } from './dto/interfaces/IAmazonDto';
import { IGoogleProductDto } from './dto/interfaces/IGoogleProductDto';
import { IYouTubeDto } from './dto/interfaces/IYouTubeDto';
import { IGoogleLinkDto } from './dto/interfaces/IGoogleLinkDto';
import { IDigiDocDto } from './dto/interfaces/IDigiDocDto';
import { IProductDto } from './dto/interfaces/IProductDto';
import { IQrCodeDto } from './dto/interfaces/IQrCodeDto';
import { AssetInfoDto } from './dto/AssetInfoDto';
import { IBookmarkDto } from './dto/interfaces/IBookmarkDto';

export class ActiveItem {
	Id: number;
	Name: string;
	AssetInfo?: AssetInfoDto;
	ArtifactIndexId: number;
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