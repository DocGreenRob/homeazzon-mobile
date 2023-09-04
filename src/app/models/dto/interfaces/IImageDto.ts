import { IFireBase } from "./IFireBase";

export interface IImageDto extends IFireBase {
	Id: number;
	Title: string;
	Description: string;
}