import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IProfileItemImageDto } from "src/app/models/dto/interfaces/IProfileItemImageDto";
import { IDigiDocDto } from "src/app/models/dto/interfaces/IDigiDocDto";
import { baseService } from "../base.service";
import { CacheService } from "../cache/cache.service";
import { IUserTypeDto } from "../../models/dto/interfaces/IUserTypeDto";

@Injectable({
  providedIn: "root",
})
export class ProfileItemImageService extends baseService {
  constructor(public override http: HttpClient, public cacheService: CacheService) {
    super(http);
  }

  async deleteProfileItemImageAsync(id: number, profileItemId: number, userTypes: Array<IUserTypeDto>) {
    var result = this.http.delete(`${environment.httpBaseUrl}/profile-item-image/${id}`).toPromise();

    if (profileItemId != 0) {
      userTypes.forEach(async (x) => {
        this.cacheService.updateProfileItem(x.Name, profileItemId);
      });
    }

    return result;
  }

  async getProfileItemImageAsync(id: number) {
    return this.http.get(`${environment.httpBaseUrl}/profile-item-image/${id}`).toPromise();
  }

  async getProfileItemImagesAsync(profileItemId: number) {
    return this.http.get(`${environment.httpBaseUrl}/profile-item-image/all/${profileItemId}`).toPromise();
  }

  async upsertProfileItemImageAsync(profileItemImage: IDigiDocDto, userTypes: Array<IUserTypeDto>) {
    var result = this.http.post(`${environment.httpBaseUrl}/profile-item-image`, profileItemImage).toPromise();

    userTypes.forEach(async (x) => {
      this.cacheService.updateProfileItem(x.Name, profileItemImage.ProfileItemId);
    });

    return result;
  }
}
