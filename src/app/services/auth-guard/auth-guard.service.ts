import { IAuthTokenDto } from "./../../models/dto/interfaces/IAuthTokenDto";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService {
  constructor(private router: Router) {}
  // TODO: remove if not being used
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let navigate: boolean = true;
    let authToken: IAuthTokenDto = JSON.parse(localStorage.getItem("AuthToken"));

    if (authToken == null) {
      navigate = false;
    } else {
      let expiryDate = Date.parse(authToken.Expires.toString());
      let now = Date.now();
      if (expiryDate < now) {
        navigate = false;
      }
    }

    if (navigate) {
      return true;
    } else {
      this.router.navigate(["sign-in"]);
      return false;
    }
  }
}
