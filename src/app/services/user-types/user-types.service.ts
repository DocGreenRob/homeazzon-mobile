import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserTypesService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  userTypeImages: any = [
    {
      Id: 2,
      image: "assets/imgs/home/owner.svg",
      name: "owner",
    },
    {
      Id: 7,
      image: "assets/imgs/home/realtor.svg",
      name: "realtor",
    },
    {
      Id: 8,
      image: "assets/imgs/architect.png",
      name: "architect",
    },
    {
      Id: 9,
      image: "assets/imgs/vendor.png",
      name: "vendor",
    },
    {
      Id: 1,
      image: "assets/imgs/home/trademan.svg",
      name: "tradesman",
    },
    {
      Id: 3,
      image: "assets/imgs/realestatedeveloper.png",
      name: "developer",
    },
    {
      Id: 0,
      image: "assets/imgs/customer.png",
      name: "customer",
    },
    {
      Id: 10,
      image: "assets/imgs/customer.png",
      name: "privateLabelUser",
    },
  ];

  getAllUserTypes() {
    return this.get("/userTypes");
  }

  async getUserAuthorizations(userId) {
    return this.get("/authorization/approved/" + userId).toPromise();
  }

  getUserTypeImages() {
    return this.userTypeImages;
  }

  async getAuthorizedProfileItems(authorizationID) {
    return this.get(+"/profileItem/getUserAuthorized/" + authorizationID).toPromise();
  }

  async removeUserAuthorized(authorizationID, profileItemId) {
    return this.get("/authorization/removeUserAuthorized/" + authorizationID + "/" + profileItemId).toPromise();
  }

  getPropertyById(propertyId, userId) {
    return this.get("/property/" + propertyId + "/" + userId);
  }

  async addUserAuthorized(authorizationID, profileItemId, propertyId) {
    return this.get("/profileItem/saveUserAuthorized/" + authorizationID + "/" + propertyId + "/" + profileItemId).toPromise();
  }

  async saveNewUserType(newUserTypeId) {
    return this.post("/user-type", { Id: newUserTypeId }).toPromise();
  }
}
