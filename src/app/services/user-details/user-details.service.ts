import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUserDto } from "src/app/models/dto/interfaces/IUserDto";
import { environment } from "src/environments/environment";
import { baseService } from "../base.service";

@Injectable({
  providedIn: "root",
})
export class UserDetailsService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async postMailingAddress(userDetails) {
    return this.post("/mailingAddress", userDetails).toPromise();
  }

  // TODO: Move to property service!
  async getProperties(userTypeId) {
    return await this.get("/property/getProperties/" + userTypeId).toPromise();
  }

  async getProperty(propertyId) {
    return await this.http.get(`${environment.httpBaseUrl}/property/${propertyId}`).toPromise();
  }

  async getProxyProperty(propertyId) {
    return await this.http.get(`${environment.httpBaseUrl}/property/proxy/${propertyId}`).toPromise();
  }

  async getMailingAddress(userTypeId) {
    return this.get("/mailingAddress/" + userTypeId).toPromise();
  }

  //post Properties
  async postProperty(property) {
    return this.post("/property", property).toPromise();
  }

  async getCompanyInformation(companyType) {
    return this.get("/companyInformation/" + companyType).toPromise();
  }

  async postCompanyInformation(companyDetails) {
    return this.post("/companyInformation", companyDetails).toPromise();
  }

  async getVendorDivisions() {
    return this.get("/division/getDivisions").toPromise();
  }

  async getUserVendorDivisions() {
    return this.get("/user/vendor").toPromise();
  }

  async postUserDivisions(selectedDivisions) {
    return this.post("/user/vendor", selectedDivisions).toPromise();
  }

  async getTradeTypes() {
    return this.get("/trades").toPromise();
  }

  async getUserTradeTypes() {
    return this.get("/user/tradesman").toPromise();
  }

  async postUserTradeTypes(tradeOptions) {
    return this.post("/user/tradesman", tradeOptions).toPromise();
  }

  async updateDefaultProperty(userId, propertyId) {
    return this.get("/property/setAsDefault/" + userId + "/" + propertyId).toPromise();
  }

  async deleteProperty(propertyId, userId, isProxy) {
    return this.get(`/property/delete/${propertyId}/${userId}/${isProxy}`).toPromise();
  }

  async setUserHasSelectedPrivateLabelerPropertyFlag(userDto: IUserDto) {
    return this.post(`/user/setUserHasSelectedPrivateLabelerPropertyFlag`, userDto).toPromise();
  }

  async setPrivateLabelUserHasCreatedPropertyFlag(userDto: IUserDto) {
    return this.post(`/user/setPrivateLabelUserHasCreatedPropertyFlag`, userDto).toPromise();
  }

  async setUserHasSeenMyPageTourFlag(userDto: IUserDto) {
    return this.post(`/user/setUserHasSeenMyPageTourFlag`, userDto).toPromise();
  }

  async getUserFlags(userId: number) {
    return this.get(`/user/get-flags`).toPromise();
  }
}
