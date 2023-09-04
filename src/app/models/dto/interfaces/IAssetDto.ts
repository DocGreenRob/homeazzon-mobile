import { IProductDetails } from "./IProductDetails";
import { IClassificationDto } from "./IClassificationDto";

export interface IAssetDto extends IClassificationDto {
	ProductDetails: IProductDetails;
}
