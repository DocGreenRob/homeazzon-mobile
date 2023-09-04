import { IUserDto_Get } from './IUserDto_Get';
import { IImageDto } from './IImageDto';

export interface ImagesDto_Patch extends IUserDto_Get {
	PropertyId: number;
	Images: Array<IImageDto>;
}