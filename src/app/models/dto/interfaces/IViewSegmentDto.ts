export interface IViewSegmentDto {
	Id: number;
	Title: string;
	IsDefault: boolean;
	DefaultSegmentId: number;
	IsDetailsView: boolean;
	IsListView: boolean;
	IsGroupListByParent: boolean;
	ParentTable: string;
	ParentTableDisplayColumn: string;
	ViewId: number;
}