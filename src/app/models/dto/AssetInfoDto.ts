export class AssetInfoDto {
	Id: number;
	Name: string;
	Title: string;
	Price: number;
	Type: string;
	// not part of AssetInfoDto.cs but part of the contract w/Item-Details and Item-Edit Pages
	// DO NOT REMOVE! 12.24.19..rg
	Description: string;
	ItemNumber: string;
	ModelNumber: string;
	Manufacturer: string;
	Make: string;
	Model: string;
	SerialNumber: string;
	Size: string;
	Length: string;
	Height: string;
	Depth: string;
	Width: string;
	TotalQuantity: number;
	Notes: string;
	Color: string;
	TotalQuantityUnit: string;
	TypeId?: number;
}

