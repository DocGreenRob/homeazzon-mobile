import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { ITagDto } from "../../models/dto/interfaces/ITagDto";

@Injectable({
  providedIn: "root",
})
export class TagService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  /*
   * This method used for fetching all tags.
   * */
  async getAllTags() {
    return this.get('/tag').toPromise();
  }

  /* 
	 * This method used for creating a new tag
	 * */
	async createTag(tagDto:ITagDto){
		return this.post('/tag', tagDto).toPromise();
	}
}
