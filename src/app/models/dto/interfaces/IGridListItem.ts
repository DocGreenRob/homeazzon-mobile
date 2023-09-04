export interface IGridListItem {
	Id: number;
	Name: string;
	Notes?: string;
	IconPath?: string;
	ImagePath?: string;
	EntityType?: string;
	EntityId?: number;
	TypeId?: number;
	AttachmentType?: string;
	ContentType?: string; //png;application/pdf;word;...
	IsUnopenedSuggestion?: boolean; // used for suggestion badges
	IsTag?: boolean;
	ArtifactId?: number;
	ArtifactIds?: Array<number>;
}
