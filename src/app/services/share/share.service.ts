import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ShareService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  /*
		This methods fetches the properties by userId
	  */
  async getProperties(userId) {
    return this.get("/share/property/" + userId).toPromise();
  }

  /*
	  This methods fetches the areas by propertyId
	*/
  getAreas(propertyIds) {
    return this.get("/share/area/" + propertyIds);
  }

  /*
	  This methods fetches the line items by areaIds and propertyIds
	*/
  async getLineItems(data) {
    return this.post("/share/lineitem/", data).toPromise();
  }

  /*
	  This methods fetches the assets by propertyIds, areaIds and lineItemIds
	*/
  getAssets(data) {
    return this.post("/share/assets/", data);
  }

  /*
	  This methods fetches the line items by propertyId
	*/
  async getLineItemsByPropertyId(propertyId) {
    return this.get("/share/propertylineItem/" + propertyId).toPromise();
  }

  /*
	  This methods fetches the assets by propertyId
	*/
  getAssetsByPropertyIdLineItemId(propertyId, lineItemIds) {
    return this.get("/share/asset/" + propertyId + "/" + lineItemIds);
  }

  /*
	  This methods fetches the assets by propertyId
	*/
  getAssetsByPropertyId(propertyId) {
    return this.get("/share/asset/" + propertyId);
  }

  /*
	  This methods fetches the Tradesman by userId
	*/
  getTradesman(userId) {
    return this.get("/share/trade/" + userId);
  }
  /*
	  This methods fetches the assets by propertyIds, and tradesIds
	*/
  getAssetsByTradesId(tradeIds, propertyIds) {
    return this.get("/share/trade/" + tradeIds + "/" + propertyIds);
  }
}
