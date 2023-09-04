import { IClassificationDto } from "./IClassificationDto";
import { AssetInfoDto } from '../AssetInfoDto';

export interface IDigiDocDto extends IClassificationDto {
	Id: number;
	ContentType: string;
	Url: string;
	AssetInfo: AssetInfoDto;
	IsUnopenedSuggestion: boolean;
	ArtifactIndexId: number;
	Description: string;
	Title: string;
}

