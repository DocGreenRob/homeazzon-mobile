import { IClassificationDto } from "./IClassificationDto";
import { AssetInfoDto } from '../AssetInfoDto';

export interface IQrCodeDto extends IClassificationDto {
	Id: number;
	Url: string;
	AssetInfo: AssetInfoDto;
	IsUnopenedSuggestion: boolean;
	ArtifactIndexId: number;
}
