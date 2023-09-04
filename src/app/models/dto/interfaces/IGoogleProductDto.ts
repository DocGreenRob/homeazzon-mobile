import { IClassificationDto } from "./IClassificationDto";
import { AssetInfoDto } from '../AssetInfoDto';

export interface IGoogleProductDto extends IClassificationDto {
	Id: number;
	Name: string;
	Description: string;
	Image: string;
	Link: string;
	Price: number;
	AssetId: number;
	AssetInfo: AssetInfoDto;
	Type: string;
	ArtifactIndexId: number;
}