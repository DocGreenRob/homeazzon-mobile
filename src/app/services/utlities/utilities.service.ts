import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { LoadingController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { EmailDto } from "../../models/dto/EmailDto";
import { IWebhookDto } from "../../models/dto/interfaces/IWebhookDto";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService extends baseService {
  loader: any;
  constructor(public override http: HttpClient, private loadingController: LoadingController) {
    super(http);
  }

  //get states
  async getStates() {
    return this.get("/state").toPromise();
  }

  async sendEmail(emailDto: EmailDto): Promise<any> {
    return this.get(`/utils/sendEmail/${emailDto.From}/${emailDto.To}/${emailDto.Subject}/${emailDto.From}/${emailDto.Message}`).toPromise();
  }

  async getRequiredMinimumVersion(): Promise<any> {
    return this.get("/utils/required-minimum-version").toPromise();
  }

  async deleteAccount(): Promise<any> {
    return this.get("/utils/delete-user-account").toPromise();
  }

  async getPrivateLabelRegistrationUrl(): Promise<any> {
    return this.get("/utils/private-label-registration-url").toPromise();
  }

  async cacheManualMakeGetRequestAsync(webhookDto: IWebhookDto) {
    return this.post('/utils/service-bus/cache-manual', webhookDto).toPromise();
  }
}
