import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductsService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async postProduct(product) {
    return this.post("/assetInfo", product).toPromise();
  }

  async postDigidocInfo(digiDocDto) {
    return this.post("/digiDoc", digiDocDto).toPromise();
  }

  moveProduct(propertyId: number, proxyPropertyId: number, profileItemId: number, lineItemId: number, assetInfoID: number) {
    return this.get(`/assetInfo/move/${propertyId}/${proxyPropertyId}/${profileItemId}/${lineItemId}/${assetInfoID}`).toPromise();
  }

  //async cloneProduct(propertyId: number, proxyPropertyId: number, profileItemId: number, lineItemId: number, assetInfoID: number) {
  //	return this.post(`/assetInfo/cloneAndMove/${propertyId}/${proxyPropertyId}/${profileItemId}/${lineItemId}/${assetInfoID}`).toPromise();
  //}

  async cloneProduct(data: any, assetInfoID: number) {
    return this.post(`/assetInfo/cloneAndMove/${assetInfoID}`, data).toPromise();
  }

  shortListExcludeProduct(product) {
    return this.post("/excludedProduct", product);
  }

  getExcludedProducts(profileItemId, lineItemId) {
    return this.get("/excludedProduct/" + profileItemId + "/" + lineItemId);
  }

  detShortListIcon(userId, lineItemId) {
    return this.get("/excludedProduct/count/" + userId + "/" + lineItemId);
  }

  removeFromExcludedShortList(productID, productType) {
    return this.get("/excludedProduct/delete/" + productType + "/" + productID);
  }

  deleteAssetProduct(userId, assetInfoID) {
    return this.get("/assetInfo/delete/" + assetInfoID + "/" + userId);
  }

  promoteProduct(to, productType, typeID, userName) {
    if (productType.toLowerCase() === "DIGIDOC" || productType.toLowerCase() === "QRCODE" || productType.toLowerCase() === "PRODUCT") {
      return this.http.get(`${environment.httpBaseUrl}/${productType.toLowerCase()}/promote/${typeID}/${to}/${userName}`);
    } else {
      return this.http.get(`${environment.httpBaseUrl}/promote/${productType}/${typeID}/${to}/${userName}`);
    }
  }
}
