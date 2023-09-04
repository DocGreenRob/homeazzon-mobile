export interface IMetattachDto {
	Id: number;
	Name: string;
	Notes: string;
	AttachmentTypeId: number;
	ParentAssetInfoId: number;
	AttachmentAssetInfoId: number;
	CurrentUser: string;
	MetaType: string;
	TypeId: number;
}