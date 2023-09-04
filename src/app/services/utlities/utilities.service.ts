import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { LoadingController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { EmailDto } from "../../models/dto/EmailDto";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService extends baseService {
  loader: any;
  constructor(public override http: HttpClient, private loadingController: LoadingController) {
    super(http);
  }

  //get loader promise
  getLoader(message) {
    this.loader = null;
    this.loader = this.loadingController.create({
      message: message,
      cssClass: "my-loading-class",
    });
    return this.loader;
  }

  //get states
  async getStates() {
    return this.get("/state").toPromise();
  }

  async sendEmail(emailDto: EmailDto): Promise<any> {
    return this.get(`/util/sendEmail/${emailDto.From}/${emailDto.To}/${emailDto.Subject}/${emailDto.From}/${emailDto.Message}`).toPromise();
  }
}
