import { IProductDetails } from "./IProductDetails";
import { IYouTubeDetails } from "./IYouTubeDetails";
import { IGoogleTextDetails } from "./IGoogleTextDetails";
import { IClassificationDto } from "./IClassificationDto";

export interface SearchResultDto extends IClassificationDto{
	ProductDetails: IProductDetails;
	YouTubeDetails: IYouTubeDetails;
	GoogleTextDetails: IGoogleTextDetails;
	
}