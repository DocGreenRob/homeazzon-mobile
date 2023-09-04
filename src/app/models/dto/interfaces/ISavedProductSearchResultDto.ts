export interface ISavedProductSearchResultDto {
	Id: number;
	Name: string;
	AssetId: number;
	AssetInfo: {
		Id: number;
		Notes: string;
		Title: string;
		Type: string;
		TypeId: number;
	};
	Description: string;
	Image: string;
	Link: string;
	Price: number;
	IsMetattach: boolean;
	IsMy: boolean;
	IsSuggest: boolean;
	IsWishlist: boolean;
	Type: string;
}
