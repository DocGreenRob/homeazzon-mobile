import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICompanyInformationDto } from "../../models/dto/interfaces/ICompanyInformationDto";
import { baseService } from "../base.service";

@Injectable({
  providedIn: "root",
})
export class CompanyInformationService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  public upsertCompanyInformationAsync(companyInformation: ICompanyInformationDto) {
    return this.post("/company-information", companyInformation).toPromise();
  }

  public getCompanyInformationAsync(id: number) {
    return this.get(`/company-information/${id}`).toPromise();
  }
}
