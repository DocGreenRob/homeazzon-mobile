import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IViewQueryDto } from "src/app/models/dto/interfaces/IViewQueryDto";

@Injectable({
  providedIn: "root",
})
export class ViewsService {
  constructor(public http: HttpClient) {
    console.log("Hello ViewsProvider Provider");
  }

  // => Array<ViewSegmentDto>
  async getViewSegmentsAsync(viewId) {
    return this.http.get(`${environment.httpBaseUrl}/view-segment/${viewId}`).toPromise();
  }

  // => Array<ViewResultDto>
  async getViewResultsAsync(viewQueryDto: IViewQueryDto) {
    return this.http.post(`${environment.httpBaseUrl}/view/results`, viewQueryDto).toPromise();
  }
}
