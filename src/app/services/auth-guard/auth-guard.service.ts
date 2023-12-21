import { IAuthTokenDto } from "./../../models/dto/interfaces/IAuthTokenDto";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService {
  constructor(private router: Router, private storageService: LocalStorageService) {}
  // TODO: remove if not being used
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let navigate: boolean = true;
    let authToken: IAuthTokenDto = this.storageService.get('AuthToken');
   
    if (authToken?.Expires) {
      let expiryDate = Date.parse(authToken.Expires.toString());
      let now = Date.now();
      if (expiryDate < now) {
        navigate = false;
      }
    } else {
      navigate = false;
    }

    if (navigate) {
      return true;
    } else {
      this.router.navigate(["sign-in"]);
      return false;
    }
  }
}
