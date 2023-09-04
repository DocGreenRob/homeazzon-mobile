import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap, retryWhen, delay, take } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class SearchService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  /*
	  This methods fetches the line items list by area id using Get API '/lineItem/area/areaId'
	  */
  async getLineItemListByAreaId(areaId) {
    return this.get("/lineItem/area/" + areaId).toPromise();
  }

  /*
	This method to get keywords by area id and line item id
	*/
  async getKeywords(areaId, lineItemId) {
    return this.get("/Keywords/" + areaId + "/" + lineItemId).toPromise();
  }

  /*
	This methods fetches the products list by custom search
	*/
  async getCustomSearchData(searchKeyword, areaId, lineItemId, userName) {
    return this.post("/SavePendingKeyword/" + areaId + "/" + lineItemId + "/" + searchKeyword + "/" + userName, {}).toPromise();
  }

  /*
	This method to get product from amazon by given keyword
	*/
  async searchAmazon(keyword: string) {
    return this.http
      .get(
        `https://api.rainforestapi.com/request?api_key=477D5A48F3604F179D3E2C8D68B36559&type=search&amazon_domain=amazon.com&search_term=${keyword}&page=1&sort_by=average_review`
      )
      .toPromise();
  }

  /*
	This method to get videos from you tube by given keyword
	*/
  async searchYouTube(searchPayloadDto) {
    return this.post("/search/youtube", searchPayloadDto).toPromise();
  }

  /*
	This method to get product from google by given keyword
	*/
  async searchGoogleProducts(searchPayloadDto) {
    return this.post("/search/google-product", searchPayloadDto).toPromise();
  }

  /*
	This method to get general product from google by given keyword
	*/
  async searchGoogle(searchPayloadDto) {
    return this.post("/search/google", searchPayloadDto).toPromise();
  }

  /*
	This method to get product from yahoo by given keyword
	*/
  async getYahooProductData(keyword) {
    return this.get("/search/yahoo/product/" + keyword).toPromise();
  }

  /*
	This method to get general product from yahoo by given keyword
	*/
  async getYahooData(keyword) {
    return this.get("/search/yahoo/" + keyword).toPromise();
  }

  /*
	This method to get product from internet explorer by given keyword
	*/
  async getInternetExplorerProductData(keyword) {
    return this.get("/search/internetExplorer/product/" + keyword).toPromise();
  }

  /*
	This method to get general product from internet explorer by given keyword
	*/
  async getInternetExplorerData(keyword) {
    return this.get("/search/internetExplorer/" + keyword).toPromise();
  }

  /*
	This method to save amazon product
	*/
  async saveAmazonData(productData) {
    return this.post("/amazon", productData).toPromise();
  }

  /*
	This method to save youtube product
	*/
  async saveYouTubeData(productData) {
    return this.post("/youtube", productData).toPromise();
  }

  /*
	This method to save google product
	*/
  async saveGoogleProductData(productData) {
    return this.post("/google-product", productData).toPromise();
  }

  /*
	This method to save general google product
	*/
  async saveGoogleData(productData) {
    return this.post("/google", productData).toPromise();
  }

  /*
	This method to get the saved amazon product
	*/
  async getSavedAmazonData(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean) {
    let partialPath: string = isProxy ? "amazon/proxy" : "amazon";
    return await this.get(`/${partialPath}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  /*
	This method to get saved youtube product
	*/
  async getSavedYouTubeData(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean) {
    let partialPath: string = isProxy ? "youtube/proxy" : "youtube";
    return await this.get(`/${partialPath}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  /*
	This method to get saved google product
	*/
  async getSavedGoogleProductData(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean) {
    let partialPath: string = isProxy ? "google-product/proxy" : "google-product";

    return await this.get(`/${partialPath}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }
  /*
	This method to get saved google general 
	*/
  async getSavedGoogleData(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean) {
    let partialPath: string = isProxy ? "google/proxy" : "google";
    return await this.get(`/${partialPath}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }
}
