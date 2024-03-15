import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IAmazonDto } from "src/app/models/dto/interfaces/IAmazonDto";
import { IDigiDocDto } from "src/app/models/dto/interfaces/IDigiDocDto";
import { IGoogleProductDto } from "src/app/models/dto/interfaces/IGoogleProductDto";
import { IItemDto } from "src/app/models/dto/interfaces/IItemDto";
import { environment } from "src/environments/environment";
import { IBookmarkDto } from "../../models/dto/interfaces/IBookmarkDto";
import { IUserTypeDto } from "../../models/dto/interfaces/IUserTypeDto";
import { IWebhookDto } from "../../models/dto/interfaces/IWebhookDto";
import { baseService } from "../base.service";
import { UtilitiesService } from "../utlities/utilities.service";
import { Constants } from "../../common/Constants";

@Injectable({
  providedIn: "root",
})
export class ItemService extends baseService {
  private _constants: Constants;

  constructor(public override http: HttpClient, private utilityService: UtilitiesService) {
    super(http);
    this._constants = new Constants();
  }

  // Google Product
  async getGoogleProduct(id: number) {
    return this.get(`/google-product/${id}`).toPromise();
  }

  async updateGoogleProduct(googleProductDto: IGoogleProductDto, userTypes: Array<IUserTypeDto>) {
    var result = this.patch(`/google-product`, googleProductDto).toPromise();

    this.updateProfileItemCache(googleProductDto.ProfileItemId);

    return result;
  }

  async deleteGoogleProduct(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/google-product/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // Google (Web)
  async getGoogleLink(id: number) {
    return this.get(`/google/${id}`).toPromise();
  }

  async deleteGoogleLink(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/google/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // YouTube
  async getYouTube(id: number) {
    return this.get(`/youtube/${id}`).toPromise();
  }

  async deleteYouTube(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/youtube/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // Amazon
  async getAmazon(id: number) {
    return this.get(`/amazon/${id}`).toPromise();
  }

  async updateAmazon(amazonDto: IAmazonDto, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.patch(`/amazon`, amazonDto).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  async deleteAmazon(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/amazon/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // Pics & Files (DigiDoc)
  async getDigiDocs(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean = false) {
    let path: string = isProxy ? "digidoc/proxy" : "digidoc";
    return await this.get(`/${path}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getDigiDoc(id: number) {
    return this.get(`/digidoc/${id}`).toPromise();
  }

  async upsertDigiDoc(digiDocDto: IDigiDocDto, userTypes: Array<IUserTypeDto>) {
    var result = this.post("/digidoc", digiDocDto).toPromise();

    this.updateProfileItemCache(digiDocDto.ProfileItemId);

    return result;
  }

  async deleteDigiDoc(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/digidoc/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // Upc
  async getUpcProducts(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean = false) {
    let path: string = isProxy ? "product/proxy" : "product";
    return await this.get(`/${path}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getUpcProduct(id: number) {
    return this.get(`/product/${id}`).toPromise();
  }

  async deleteUpcProduct(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/product/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // QrCode
  async getQrCodes(propertyId: number, profileItemId: number, lineItemId: number, lineItemTypeId: number, isProxy: boolean = false) {
    let path: string = isProxy ? "qrcode/proxy" : "qrcode";
    return await this.get(`/${path}/${propertyId}/${profileItemId}/${lineItemId}/${lineItemTypeId}`).toPromise();
  }

  async getQrCode(id: number) {
    return this.get(`/qrCode/${id}`).toPromise();
  }

  async deleteQrCode(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/qrCode/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // Bookmarks
  async getBookmarks(profileItemId: number, lineItemId: number) {
    return await this.http.get(`${environment.httpBaseUrl}/bookmark/${profileItemId}/${lineItemId}`).toPromise();
  }

  async getBookmark(id: number) {
    return await this.http.get(`${environment.httpBaseUrl}/bookmark/${id}`).toPromise();
  }

  async deleteBookmark(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.http.delete(`${environment.httpBaseUrl}/bookmark/${id}`).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  async upsertBookmark(bookmark: IBookmarkDto, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.http.post(`${environment.httpBaseUrl}/bookmark`, bookmark).toPromise();

    this.updateProfileItemCache(profileItemId);

    return result;
  }

  // Generics
  async deleteItemFromCategories(itemDto: IItemDto) {
    return this.post(`/item/delete-item-from-categories/trigger`, itemDto).toPromise();
  }

  async setSuggestionIsOpened(artifactId: number, artifactType: string, proxyPropertyId: number) {
    return this.http.get(`${environment.httpBaseUrl}/item/suggestion/opened/${artifactId}/${artifactType}/${proxyPropertyId}`).toPromise();
  }

  private async updateProfileItemCache(profileItemId) {
    let updateCacheUrl: IWebhookDto = {} as IWebhookDto;

    let c = this._constants;
    let b = c.UserTypes;

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Developer}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Owner}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Realtor}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Tradesman}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Vendor}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Appraiser}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Architect}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);

    updateCacheUrl.Route = `profileItem/${profileItemId}/${b.Bank}/no-cache`;
    await this.utilityService.cacheManualMakeGetRequestAsync(updateCacheUrl);
  }
}
