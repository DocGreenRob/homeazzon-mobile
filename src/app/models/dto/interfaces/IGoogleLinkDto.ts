import { IClassificationDto } from "./IClassificationDto";


export interface IGoogleLinkDto extends IClassificationDto  {
	Id: number;
	Title: string;
	Description: string;
	Link: string;
	ArtifactIndexId: number;
}