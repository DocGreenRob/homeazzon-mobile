import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import jwt_decode from 'jwt-decode';
import { environment } from "src/environments/environment";
import { IUserDto } from "../../models/dto/interfaces/IUserDto";
import { baseService } from "../base.service";
import { IAuthTokenDto } from "./../../models/dto/interfaces/IAuthTokenDto";
import { IdTokenDto } from "./../../models/dto/interfaces/IdTokenDto";

@Injectable({
  providedIn: "root",
})
export class AccountService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  authenticate(loginDto) {
    let formData: any = `grant_type=password&username=${loginDto.email.trim()}&password=${loginDto.pwd}&client_id=mypad-mobile`;
    return this.http
      .post(`${environment.httpBase}/token`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      })
      .toPromise();
  }

  getUser() {
    return this.get("/user").toPromise();
  }

  signUp(signUpObj: IUserDto) {
    return this.post("/user/register", signUpObj).toPromise();
  }

  sendVerificationEmail(email, subject, message) {
    return this.get(
      "http://emailservice.cognitivegenerationenterprises.com/home/sendemail?toEmail=" + email + "&subject=" + subject + "&message=" + message
    ).toPromise();
  }

  getAppShaReregister(data) {
    return this.post("/user/appShare/register", data).toPromise();
  }
  addCoOwner(data) {
    return this.post("/property/addCoOwner", data);
  }
  addprivatelabellogo(pendingPrivateLabelUserId) {
    return this.get("/privateLabel/" + pendingPrivateLabelUserId + "/logo").toPromise();
  }

  isAuthTokenValid() {
    try {
      // debugger;
      let token: IAuthTokenDto = JSON.parse(localStorage.getItem("AuthToken"));
      // let IdToken: IdTokenDto = JSON.parse(localStorage.getItem("IdToken"));

      if (token == null) {
        return false;
      } else {
        let decodedToken = this.decodeToken(token.Access_token);
        let currentUnixTimeStamp = Math.round(new Date().getTime() / 1000);
        // debugger;
        //check token expiry date
        if (decodedToken.exp && decodedToken.iat) {
          if (currentUnixTimeStamp >= decodedToken.exp) {
            return false;
          } else {
            return true;
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    } 
  }

  decodeToken(token: string): any {
    // somewhere in your code...
    try {
      const decodedToken = jwt_decode(token);
      if (decodedToken) {
        // Handle decoded token here...
        console.log('JWT claims:', decodedToken);

        return decodedToken;
      } else {
        console.log('Failed to decode JWT token');
      }
    } catch (error) {
      console.log('Error decoding JWT token:', error);
    }
  }
}
