import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CacheService } from "../cache/cache.service";
import { IUserTypeDto } from "../../models/dto/interfaces/IUserTypeDto";

@Injectable({
  providedIn: "root",
})
export class PropertyProfilesService extends baseService {
  constructor(public override http: HttpClient, public cacheService: CacheService) {
    super(http);
  }

  async getProfileItems(profileItemId, userType) {
    return await this.get("/profileItem/" + profileItemId + "/" + userType).toPromise();
  }

  async postProfile(profileItems: Array<any>, propertyId: number, userTypes: Array<IUserTypeDto>) {
    var result = await this.post("/profileItem", profileItems).toPromise();

    userTypes.forEach(async (x) => {
      await this.cacheService.updateProperty(propertyId, x.Id);
    });

    return result;
  }

  async deleteLineItem(profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/profileItem/${profileItemId}`).toPromise();

    userTypes.forEach(async (x) => {
      await this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  getAreaTypes(type) {
    return this.get("/area/getAreasByType/" + type).toPromise();
  }

  async determineEditing(profileItemId, userId) {
    return this.get("/profileItem/exclude/count/" + profileItemId + "/" + userId).toPromise();
  }

  getExcludedLineItems(profileItemId, userId) {
    return this.get("/profileItem/excluded/" + profileItemId + "/" + userId).toPromise();
  }

  removeLineItemFromExcludeList(profileItemId, userId, lineItemId, userTypes: Array<IUserTypeDto>) {
    var result = this.get("/lineItem/exclude/remove/" + lineItemId + "/" + profileItemId + "/" + userId).toPromise();

    userTypes.forEach(async (x) => {
      await this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  addLineItemToExcludeList(profileItemId, userId, lineItemId, userTypes: Array<IUserTypeDto>) {
    var result = this.get("/lineItem/exclude/" + lineItemId + "/" + profileItemId + "/" + userId);

    userTypes.forEach(async (x) => {
      await this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  async getProxyPropertyLineItemProducts(propertyId, ProfileItemID, lineItemId, lineTypeID, platform, userId, uuid) {
    return await this.get(
      "/product/proxyProperty/profileItem/lineItem/" + propertyId + "/" + ProfileItemID + "/" + lineItemId + "/" + userId + "/" + uuid + "/" + platform
    ).toPromise();
  }

  async getNonProxyPropertyLineItemProducts(propertyId, ProfileItemID, lineItemId, lineTypeID, platform, userId, uuid) {
    return await this.get(
      "/product/property/profileItem/lineItem/" + userId + "/" + propertyId + "/" + ProfileItemID + "/" + lineItemId + "/" + uuid + "/" + platform
    ).toPromise();
  }

  async getProxyDigiDoc(propertyId, ProfileItemID, lineItemId, lineTypeID, platform, userId, uuid) {
    return await this.get(
      "/digiDoc/proxy/profileItem/lineItem/lineItemType/" +
        propertyId +
        "/" +
        ProfileItemID +
        "/" +
        lineItemId +
        "/" +
        lineTypeID +
        "/" +
        userId +
        "/" +
        uuid +
        "/" +
        platform
    ).toPromise();
  }

  async getNonProxyDigiDoc(propertyId, ProfileItemID, lineItemId, lineTypeID, platform, userId, uuid) {
    return await this.get(
      "/digiDoc/property/profileItem/lineItem/lineItemType/" +
        userId +
        "/" +
        propertyId +
        "/" +
        ProfileItemID +
        "/" +
        lineItemId +
        "/" +
        lineTypeID +
        "/" +
        uuid +
        "/" +
        platform
    ).toPromise();
  }

  async getProxyQRCodes(propertyId, ProfileItemID, lineItemId, lineTypeID, platform, userId, uuid) {
    return await this.get(
      "/qrCode/proxyProperty/profileItem/lineItem/" + propertyId + "/" + ProfileItemID + "/" + lineItemId + "/" + userId + "/" + uuid + "/" + platform
    ).toPromise();
  }

  async getNonProxyQRCodes(propertyId, ProfileItemID, lineItemId, lineTypeID, platform, userId, uuid) {
    return await this.get(
      "/qrCode/property/profileItem/lineItem/" + userId + "/" + propertyId + "/" + ProfileItemID + "/" + lineItemId + "/" + uuid + "/" + platform
    ).toPromise();
  }

  async getSavedGoogleData_proxy(userId, propertyId, profileItemId, lineItemId, lineItemTypeId) {
    return await this.get(`/google/proxy/${userId}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getSavedGoogleProductData_proxy(userId, propertyId, profileItemId, lineItemId, lineItemTypeId) {
    return await this.get(`/google-product/proxy/${userId}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getSavedAmazonData_proxy(userId, propertyId, profileItemId, lineItemId, lineItemTypeId) {
    return await this.get(`/amazon/proxy/${userId}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getSavedYouTubeData_proxy(userId, propertyId, profileItemId, lineItemId, lineItemTypeId) {
    return await this.get(`/youtube/proxy/${userId}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getPropertyLineitemsAsync(id: number, isProxy: boolean) {
    return await this.get(`/property/lineitems/${id}/${isProxy}`).toPromise();
  }

  async getUserProfileItemLineitems(profileItemId) {
    return await this.http.get(`${environment.httpBaseUrl}/lineitem/user/profile-item/${profileItemId}`).toPromise();
  }

  /* Previously Pre-Pre Construction 
	---Feature/PPC
    
	*/
  /*
	  This methods for add user profile
	  */
  addUserProfile(data) {
    return this.post("/ppcProperty", data).toPromise();
  }

  /*
	  This methods for add user profile
	  */
  async addUserProperty(payloadDto) {
    return this.post("/ppcProperty", payloadDto).toPromise();
  }

  /*
	  This method is for Get Property by ID
	  */
  async getPropertyById(propertyId) {
    return await this.get("/property/" + propertyId).toPromise();
  }

  async getPropertiesById(propertyIds) {
    return await this.post("/properties", propertyIds).toPromise();
  }

  async getProfileItemsByIds(profileItemIds, userType) {
    var data = {
      profileItemIds: profileItemIds,
      userType: userType,
    };
    return await this.post("/getProfileItems/" + userType, profileItemIds).toPromise();
  }
}
