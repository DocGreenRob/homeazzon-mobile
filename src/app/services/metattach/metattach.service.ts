import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IMetattachDto } from "src/app/models/dto/interfaces/IMetattachDto";
import { baseService } from "../base.service";

@Injectable({
  providedIn: "root",
})
export class MetattachService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async getMetattachCount(assetInfoId, youtubeId, googleId) {
    return this.get("/metattach/count/" + assetInfoId + "/" + youtubeId + "/" + googleId).toPromise();
  }

  getMetattachments(assetInfoId) {
    return this.get(`/metattach/${assetInfoId}`).toPromise();
  }

  async saveMetattach(metattachData: IMetattachDto) {
    return this.post("/metattach", metattachData).toPromise();
  }

  /* beta (start) */
  async getMetattachTypeByLineItemId(lineItemId) {
    return this.get("/metattach/type/" + lineItemId).toPromise();
  }

  async deleteAttachment(id: number) {
    return this.delete(`/metattach/${id}`).toPromise();
  }
}
