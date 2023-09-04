export interface IClassificationDto {
	// property
	PropertyId: number;
	ProxyPropertyId: number;

	// what area/room in property
	ProfileItemId: number;
	LineItemId: number;
	LineItemLineItemTypeId: number;

	// what list in area/room
	IsMy: boolean;
	IsWishlist: boolean;
	IsSuggest: boolean;
	IsMetattach: boolean;

	// meta data about the "thing"
	AssetInfoId: number;
}