import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PrivatelabelerSettingsService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

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
