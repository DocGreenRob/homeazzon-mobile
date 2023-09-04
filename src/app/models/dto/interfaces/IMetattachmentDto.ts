import { AssetInfoDto } from 'src/app/models/dto/AssetInfoDto';
import { IDigiDocDto } from "./IDigiDocDto";
import { IQrCodeDto } from "./IQrCodeDto";
import { IProductDto } from "./IProductDto";
import { IYouTubeDto } from "./IYouTubeDto";
import { IAmazonDto } from "./IAmazonDto";
import { IGoogleProductDto } from "./IGoogleProductDto";
import { IGoogleLinkDto } from "./IGoogleLinkDto";

export interface IMetattachmentDto {
	Id: number;
	Name: string;
	Type: string;
	Notes: string;
	DigiDoc?: IDigiDocDto;
	QRCode?: IQrCodeDto;
	Product?: IProductDto;
	YouTube?: IYouTubeDto;
	Amazon?: IAmazonDto;
	GoogleProduct?: IGoogleProductDto;
	GoogleText?: IGoogleLinkDto;
	TypeId: number; // used for AttachmentTypeId
	AssetInfo: AssetInfoDto
}
