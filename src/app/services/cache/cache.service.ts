import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { BasePage } from "../../pages/base/base.page";
import { baseService } from "../base.service";
import { UserDetailsService } from "../user-details/user-details.service";
import { Constants } from "../../common/Constants";

@Injectable({
  providedIn: "root",
})
export class CacheService extends baseService {
  @Output() _eventEmitter: any = new EventEmitter();
  private _constants: Constants;

  constructor(public override http: HttpClient, public userDetailsService: UserDetailsService) {
    super(http);
    this._constants = new Constants();
  }

  async updateProfileItem(userType: string, profileItemId?: number) {
    // new
    return await this.get(`/cache/update/profile-item/${profileItemId}/${this.getUserName(userType)}`).toPromise();
  }

  async updateProperty(propertyId: number, userTypeId: number) {
    let ctr: number = 0;

    return await this.get(`/cache/update/property/${propertyId}/${userTypeId}`)
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

  private getUserName(userName: string) {
    if (userName.toLowerCase().indexOf('tradesman') > -1) {
      return this._constants.UserTypes.Tradesman;
    }
    if (userName.toLowerCase().indexOf('owner') > -1) {
      return this._constants.UserTypes.Owner;
    }
    if (userName.toLowerCase().indexOf('developer') > -1) {
      return this._constants.UserTypes.Developer;
    }
    if (userName.toLowerCase().indexOf('appraiser') > -1) {
      return this._constants.UserTypes.Appraiser;
    }
    if (userName.toLowerCase().indexOf('architect') > -1) {
      return this._constants.UserTypes.Architect;
    }
    if (userName.toLowerCase().indexOf('bank') > -1) {
      return this._constants.UserTypes.Bank;
    }
    if (userName.toLowerCase().indexOf('realtor') > -1) {
      return this._constants.UserTypes.Realtor;
    }
    if (userName.toLowerCase().indexOf('vendor') > -1) {
      return this._constants.UserTypes.Vendor;
    }
    throw new Error('User type not found');
  }
}
