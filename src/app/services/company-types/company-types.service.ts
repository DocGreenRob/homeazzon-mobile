import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseService } from "../base.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CompanyTypesService extends baseService {
  companyTypes: any = [];
  constructor(public override http: HttpClient) {
    super(http);
  }
  getCompanyTypes() {
    return this.get("/companyType");
  }
}
