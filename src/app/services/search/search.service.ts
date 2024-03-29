import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap, retryWhen, delay, take } from "rxjs/operators";
import { validateEventsArray } from "@angular/fire/compat/firestore";
@Injectable({
  providedIn: "root",
})
export class SearchService extends baseService {
  private httpClient: HttpClient;
  constructor(public override http: HttpClient, private handler: HttpBackend) {
    super(http);
    this.httpClient = new HttpClient(handler);
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
    // Rainforest Api
    return this.httpClient
      .get(
        `https://api.rainforestapi.com/request?api_key=477D5A48F3604F179D3E2C8D68B36559&type=search&amazon_domain=amazon.com&search_term=${keyword}&page=1&sort_by=average_review`
      )
      .toPromise();

    // Search Api
    //return this.http
    //  .get(
    //    `https://www.searchapi.io/api/v1/search?api_key=RFuRhp1yiMywsBcdwFrwVaJw&engine=amazon_search&q=${keyword}`
    //  )
    //  .toPromise();
  }
  /*
  This method to get product from amazon
  */
  async searchAmazonProduct2(keyword: string) {
    return this.httpClient.get(`https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?domainCode=com&keyword=${keyword}&page=1&excludeSponsored=false&sortBy=relevanceblender&withCache=true`, { headers: {
      'X-RapidAPI-Key': '5a9afa6809mshef0e809ac690986p12c3f9jsnd49b37072944',
			'X-RapidAPI-Host': 'axesso-axesso-amazon-data-service-v1.p.rapidapi.com'
    } }).toPromise();
  }
  /*
  This method to get product from amazon
  */
  async searchAmazonProduct(keyword: string,page:number) {
    return this.httpClient.get(`https://real-time-amazon-data.p.rapidapi.com/search?query=${keyword}&page=${page}&country=US&category_id=aps`, { headers: {
      'X-RapidAPI-Key': '5a9afa6809mshef0e809ac690986p12c3f9jsnd49b37072944',
			'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }}).toPromise();
  }
  /*
  This method to get videos from you tube by given keyword
  */
  // async searchYouTube(searchPayloadDto) {
  //   return this.post("/search/youtube", searchPayloadDto).toPromise();
  // }
  async searchYouTube(searchPayloadDto) {
    return this.httpClient.get(`https://serpapi.com/search.json?engine=youtube&search_query=${searchPayloadDto}&api_key=a21392149805619936085f1705cf3ec016e885d9aedc96131d4fa6e427b6e48d`).toPromise();
  }
  async searchGoogleVedios(searchkey) {
    return this.httpClient.get(`https://serpapi.com/search.json?engine=google_videos&q=${searchkey}&google_domain=google.com&start=0&num=25&device=mobile&api_key=a21392149805619936085f1705cf3ec016e885d9aedc96131d4fa6e427b6e48d`).toPromise();
  }

  /*
  This method to get product from google by given keyword
  */
  async searchGoogleProducts(searchPayloadDto,startpage,endpage) {
    // return this.post("/search/google-product", searchPayloadDto).toPromise();
    return this.httpClient
    .get(
      `https://serpapi.com/search.json?engine=google_shopping&q=${searchPayloadDto}&location=United+States&google_domain=google.com&gl=us&hl=en&start=${startpage}&num=${endpage}&device=mobile&api_key=a21392149805619936085f1705cf3ec016e885d9aedc96131d4fa6e427b6e48d`
      ).toPromise();
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
