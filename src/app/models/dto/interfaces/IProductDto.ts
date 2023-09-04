import { IClassificationDto } from "./IClassificationDto";
import { AssetInfoDto } from '../AssetInfoDto';


export interface IProductDto extends IClassificationDto {
	Id: number;
	Name: string;
	Image: string;
	BarCode: string;
	BarCodeType: string;
	Price: number;
	AssetInfo: AssetInfoDto;
	IsUnopenedSuggestion: boolean;
	ArtifactIndexId: number;
}