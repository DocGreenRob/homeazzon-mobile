import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { BasePage } from "../../pages/base/base.page";
import { baseService } from "../base.service";
import { UserDetailsService } from "../user-details/user-details.service";

@Injectable({
  providedIn: "root",
})
export class CacheService extends baseService {
  @Output() _eventEmitter: any = new EventEmitter();

  constructor(public override http: HttpClient, public userDetailsService: UserDetailsService) {
    super(http);
  }

  async updateProfileItem(userType: string, profileItemId?: number) {
    // new
    //return await this.get(`/cache/update/profile-item/${profileItemId}/${userType}`).toPromise();
    return await this.get(`/update-cache/profileItem/${profileItemId}/${userType}`).toPromise();
  }

  async updateProperty(propertyId: number, userTypeId: number) {
    let ctr: number = 0;

    return await this.get(`/update-cache/property/${propertyId}/${userTypeId}`)
      .toPromise()
      .then((y) => {
        //if (ctr === 0) {
        //	this.userDetailsService.getProperty(propertyId)
        //		.then((x: any) => {
        //			//this.ActiveProperty = x;
        //			//this._eventEmitter.emit();
        //		})
        //		.catch(err => { });
        //}
        //ctr += 1;
      });
  }

  async updateLineItems(profileItemId: number) {
    return await this.get(`/cache/update/line-items/${profileItemId}`).toPromise();
  }

  //async updateProperty(propertyId?: number) {

  //	if (propertyId === null) {
  //		propertyId = this.ActiveProperty.Id;
  //	}

  //	let ctr: number = 0;

  //	this.User.Types.forEach(async (x) => {
  //		return await this.get(`/update-cache/property/${propertyId}/${x.Id}`).toPromise().then(y => {

  //			if (ctr === 0) {
  //				this.userDetailsService.getProperty(propertyId)
  //					.then((x: any) => {
  //						this.ActiveProperty = x;
  //						this._eventEmitter.emit();
  //					})
  //					.catch(err => { });
  //			}

  //			ctr += 1;
  //		});
  //	});
  //}
}
