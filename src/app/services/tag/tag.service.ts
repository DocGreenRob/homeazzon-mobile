import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";

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
    return this.get("/tag").toPromise();
  }
}
