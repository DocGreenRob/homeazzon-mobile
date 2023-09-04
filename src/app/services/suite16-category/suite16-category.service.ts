import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class Suite16CategoryService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async getSuite16Categories() {
    return this.get(`/suite-16-category`).toPromise();
  }

  async getLineitems(id: number) {
    return this.get(`/lineItem/suite-16-category/${id}`).toPromise();
  }

  async getAreaLineitems(areaId: number, suite16CategoryId: number) {
    return this.get(`/lineItem/suite-16-category/${suite16CategoryId}/area/${areaId}`).toPromise();
  }
}
