import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IGoogleProductDto } from "src/app/models/dto/interfaces/IGoogleProductDto";
import { IAmazonDto } from "src/app/models/dto/interfaces/IAmazonDto";
import { IDigiDocDto } from "src/app/models/dto/interfaces/IDigiDocDto";
import { IItemDto } from "src/app/models/dto/interfaces/IItemDto";
import { IBookmarkDto } from "../../models/dto/interfaces/IBookmarkDto";
import { CacheService } from "../cache/cache.service";
import { IUserTypeDto } from "../../models/dto/interfaces/IUserTypeDto";

@Injectable({
  providedIn: "root",
})
export class ItemService extends baseService {
  constructor(public override http: HttpClient, public cacheService: CacheService) {
    super(http);
  }

  // Google Product
  async getGoogleProduct(id: number) {
    return this.get(`/google-product/${id}`).toPromise();
  }

  async updateGoogleProduct(googleProductDto: IGoogleProductDto, userTypes: Array<IUserTypeDto>) {
    var result = this.patch(`/google-product`, googleProductDto).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, googleProductDto.ProfileItemId);
    });

    return result;
  }

  async deleteGoogleProduct(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/google-product/${id}`).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  // Google (Web)
  async getGoogleLink(id: number) {
    return this.get(`/google/${id}`).toPromise();
  }

  async deleteGoogleLink(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/google/${id}`).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  // YouTube
  async getYouTube(id: number) {
    return this.get(`/youtube/${id}`).toPromise();
  }

  async deleteYouTube(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/youtube/${id}`).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  // Amazon
  async getAmazon(id: number) {
    return this.get(`/amazon/${id}`).toPromise();
  }

  async updateAmazon(amazonDto: IAmazonDto, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.patch(`/amazon`, amazonDto).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  async deleteAmazon(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/amazon/${id}`).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

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

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, digiDocDto.ProfileItemId);
    });

    return result;
  }

  async deleteDigiDoc(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.delete(`/digidoc/${id}`).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

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

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

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

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

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

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  async upsertBookmark(bookmark: IBookmarkDto, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.http.post(`${environment.httpBaseUrl}/bookmark`, bookmark).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemId);
    });

    return result;
  }

  // Generics
  async deleteItemFromCategories(itemDto: IItemDto) {
    return this.post(`/item/delete-item-from-categories/trigger`, itemDto).toPromise();
  }

  async setSuggestionIsOpened(artifactId: number, artifactType: string, proxyPropertyId: number) {
    return this.http.get(`${environment.httpBaseUrl}/item/suggestion/opened/${artifactId}/${artifactType}/${proxyPropertyId}`).toPromise();
  }
}
