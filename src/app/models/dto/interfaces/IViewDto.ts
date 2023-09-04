import { IViewSegmentDto } from "src/app/models/dto/interfaces/IViewSegmentDto";

export interface IViewDto {
	Id: number;
	DefaultSegmentId: number;
	ViewSegments: Array<IViewSegmentDto>;
}