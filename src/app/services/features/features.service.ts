import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseService } from "../base.service";

@Injectable({
  providedIn: "root",
})
export class FeaturesService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
    console.log("Hello FeaturesProvider Provider");
  }

  async subscribe(featureId: number) {
    return this.get(`/feature/subscribe/${featureId}`).toPromise();
  }

  async getFeatures() {
    return this.get(`/feature`).toPromise();
  }
}
