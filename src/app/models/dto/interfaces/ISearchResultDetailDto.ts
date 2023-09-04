export interface ISearchResultDetailDto {
	Image?: string;
	Name?: string;
	Description?: string;
	Link?: string;
	Price?: number;

	Title?: string;
	VideoID?: string;
	ThumbnailImg?: string;
	VideoUrl?: string;
	VideoDescription?: string;
	VideoDuration?: any; // TODO: determine correct type
	TotalViews?: any; // TODO: determine correct type
}
