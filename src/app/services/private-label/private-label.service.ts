import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseService } from "../base.service";
import { environment } from "src/environments/environment";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { IPrivateLabelUserPropertyDto } from "src/app/models/dto/interfaces/IPrivateLabelUserPropertyDto";

@Injectable({
  providedIn: "root",
})
export class PrivateLabelService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  getShowSharewithPartner() {
    return this.get(`/user-share/shouldShowShareWithPartner`).toPromise();
  }

  shareWithPartner(data) {
    return this.post("/user/app/partnerShare", data).toPromise();
  }

  async getPrivateLabelProperties(privateLabelId: number) {
    return this.get(`/privateLabel/${privateLabelId}/homes`).toPromise();
  }

  async getPrivateLabelProfileImages(propertyId: number) {
    return this.get(`/property/${propertyId}/images`).toPromise();
  }

  async getPropertyOverview(propertyId: number) {
    return this.get(`/privateLabel/profile/${propertyId}`).toPromise();
  }

  async getPrivateLabelProfilePlans(profileId) {
    return this.get("/privateLabel/profile/" + profileId + "/plans").toPromise();
  }

  async getPropertyDevelopments(propertyId: number) {
    return this.get(`/property/${propertyId}/developments`).toPromise();
  }

  async peekDevelopmentLots(developmentId: number) {
    return this.get(`/property/development/${developmentId}/lots/peek`).toPromise();
  }

  async getPrivateProfile(data) {
    return this.post("/privateLabel/profile/", data).toPromise();
  }

  getPrivateLabellotsprofile(profileId) {
    return this.get("/privateLabel/lots/profile/" + profileId);
  }

  getPrivateLabelProfile(profileId) {
    return this.get("/privateLabel/profile/" + profileId);
  }

  async getPrivateLabelerDevelopments(privateLabelerId: number) {
    return this.get(`/property/private-labeler/${privateLabelerId}/developments`).toPromise();
  }

  async getLotDetails(lotId: number) {
    return this.get(`/property/lot/${lotId}`).toPromise();
  }

  async saveCustomPropertyAsync(property: IPropertyDto): Promise<any> {
    return this.post(`/property/saveCustomProperty`, property).toPromise();
  }

  async saveSelectedProperty(selectedProperty: IPrivateLabelUserPropertyDto): Promise<any> {
    return this.post(`/privateLabel/profile`, selectedProperty).toPromise();
  }

  async getDesignPlans(propertyId) {
    return this.get(`/property/${propertyId}/pdfplans`).toPromise();
  }

  /* Previously PrivateLabelerSettings 
	--PrivateLabelerSetting--
  
	*/

  async getPrivateLabelerUser(userId) {
    return this.get("/privatelabeler/getPrivateLabelerProperties/" + userId).toPromise();
  }

  async getPrivateLabeler(userId) {
    return this.get("/privatelabeler/getProperties/" + userId).toPromise();
  }

  removeClone(userId, settingId) {
    return this.get("/privatelabeler/removeclone/" + settingId + "/" + userId);
  }

  addClone(userId, settingID) {
    return this.get("/privatelabeler/request/" + settingID + "/" + userId);
  }

  getTradesmanMaterials(profileID, userId, lineItemId) {
    return this.get("/tradesman/materialDetails/" + profileID + "/" + lineItemId + "/" + userId);
  }

  postTradesmanMaterial(postObj) {
    return this.post("/tradesman/materialDetails", postObj);
  }

  //publicise property
  publicizeProperty(settinID, state) {
    return this.get("/privatelabeler/public/" + settinID + "/" + state);
  }

  //auto clone on/off for a property
  autoclonePropertyOnOff(settinID, state) {
    return this.get("/privatelabeler/autoclone/" + settinID + "/" + state);
  }

  addUser(userId, settingID) {
    return this.get("/privatelabeler/removeUser/" + settingID + "/" + userId);
  }

  removeUser(userId, settingID) {
    return this.get("/privatelabeler/addUser/" + settingID + "/" + userId);
  }
}
