import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class StaticDataProvider {
  constructor(public http: HttpClient) {}

  async getStates() {
    return this.http.get(`${environment.httpBaseUrl}/state`).toPromise();
  }
}
