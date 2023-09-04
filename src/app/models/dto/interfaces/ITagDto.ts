export interface ITagDto {
    Id: number;
    Name: string;
    ParentTagId: number;
    TagContextId: number;
    ArtifactIndexId: number;
    ArtifactIndexIds: number;
    ArtifactId: number;
    ArtifactIds: Array<number>;
}
