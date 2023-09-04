import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { ArtifactIndexTagDto } from "src/app/models/dto/interfaces/ArtifactIndexTagDto";
import { environment } from "src/environments/environment";
import { ArtifactIndexContactInformationDto } from "../../models/dto/interfaces/ArtifactIndexContactInformationDto";

@Injectable({
  providedIn: "root",
})
export class ArtifactIndexService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  // Tag
  async insertArtifactIndexTag(artifactIndexTagDto: ArtifactIndexTagDto) {
    return this.http.post(`${environment.httpBaseUrl}/artifact-index/tag`, artifactIndexTagDto).toPromise();
  }

  async deleteArtifactIndexTag(artifactIndexTagDto: ArtifactIndexTagDto) {
    return this.http
      .delete(`${environment.httpBaseUrl}/artifact-index/${artifactIndexTagDto.ArtifactIndexId}/tag/${artifactIndexTagDto.TagContextId}`)
      .toPromise();
  }

  async getArtifactIndexTag(artifactIndexId: number) {
    return this.http.get(`${environment.httpBaseUrl}/artifact-index/${artifactIndexId}/tag`).toPromise();
  }

  // Contact Information
  async insertContactInformation(artifactIndexContactInformation: ArtifactIndexContactInformationDto) {
    return this.http.post(`${environment.httpBaseUrl}/artifact-index/contact-information`, artifactIndexContactInformation).toPromise();
  }

  async deleteContactInformation(artifactIndexId: number, contactInformationId: number) {
    return this.http.delete(`${environment.httpBaseUrl}/artifact-index/${artifactIndexId}/contact-information/${contactInformationId}`).toPromise();
  }

  async getContactInformation(artifactIndexId: number) {
    return this.http.get(`${environment.httpBaseUrl}/artifact-index/${artifactIndexId}/contact-information`).toPromise();
  }
}
