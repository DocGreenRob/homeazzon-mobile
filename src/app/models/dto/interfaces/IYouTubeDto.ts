import { IClassificationDto } from "./IClassificationDto";

export interface IYouTubeDto extends IClassificationDto {
	Id: number;
	ThumbnailImg: string;
	Title: string;
	TotalViews: number;
	VideoDescription: string;
	VideoDuration: string;
	VideoID: string;
	VideoUrl: string;
	ArtifactIndexId: number;
}

