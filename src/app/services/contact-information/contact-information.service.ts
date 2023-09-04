import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IContactInformationDto } from "../../models/dto/interfaces/IContactInformationDto";
import { baseService } from "../base.service";

@Injectable({
  providedIn: "root",
})
export class ContactInformationService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async getAllAsync() {
    return this.get(`/contact-information`).toPromise();
  }

  async getAsync(id: number) {
    return this.get(`/contact-information/${id}`).toPromise();
  }

  async getArtifactContactInformationAsync(artifactType: string, artifactId: number) {
    return this.get(`/contact-information/${artifactType}/${artifactId}`).toPromise();
  }

  async deleteGoogleLinkAsync(id: number) {
    let result = this.delete(`/contact-information/${id}`).toPromise();
    return result;
  }

  async upsertContactInformationAsync(contactInformationDto: IContactInformationDto) {
    var result = this.post("/contact-information", contactInformationDto).toPromise();
    return result;
  }
}
