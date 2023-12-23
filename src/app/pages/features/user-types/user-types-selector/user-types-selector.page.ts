import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { MenuController, NavController, Platform } from "@ionic/angular";
import { Constants } from "../../../../common/Constants";
import { IUserTypeDto } from "../../../../models/dto/interfaces/IUserTypeDto";
import { ProfileItemImageDto } from "../../../../models/dto/ProfileItemImageDto";
import { CommunicatorService } from "../../../../services/communicator/communicator.service";
import { FeaturesService } from "../../../../services/features/features.service";
import { UserTypesService } from "../../../../services/user-types/user-types.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { BasePage } from "../../../base/base.page";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-user-types-selector",
  templateUrl: "./user-types-selector.page.html",
  styleUrls: ["./user-types-selector.page.scss"],
})
export class UserTypesSelectorPage extends BasePage {
  public userTypes: Array<IUserTypeDto>;
  public userTypesAnynomousType: Array<any>;
  private _constants: Constants;
  public profileItemImages: Array<ProfileItemImageDto>;

  constructor(
    public override navController: NavController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override userTypesService: UserTypesService,
    public override inAppBrowser: InAppBrowser,
    public override featuresService: FeaturesService,
    public override storageService: LocalStorageService
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    this._constants = new Constants();
  }

  override ngOnInit() {
    if (this.User?.Types?.length && this.User?.Types?.some((x) => x.Name !== this._constants.UserTypes.Unassigned)) {
      this.router.navigate(["dashboard"]);
    }

    if (this.UserTypes?.length) {
      this.filterUserTypes();
    } else {
      this.getUserTypes();
    }
  }

  private async getUserTypes() {
    this.userTypesService.getAllUserTypes().subscribe((response: Array<IUserTypeDto>) => {
      this.UserTypes = response;
      this.filterUserTypes();
    });
  }

  filterUserTypes() {
    this.userTypes = this.UserTypes.filter((x) => x.IsActive).filter((x) => x.Name !== this._constants.UserTypes.Unassigned);
    this.userTypesAnynomousType = this.userTypes;

    let currentUserUserTypes: any = this.User.Types;

    for (var i = 0; i < this.userTypesAnynomousType.length; i++) {
      if (currentUserUserTypes.some((x) => x.Name == this.userTypesAnynomousType[i].Name)) {
        this.userTypesAnynomousType[i].IsSubscribed = true;
      } else {
        this.userTypesAnynomousType[i].IsSubscribed = false;
      }

      if (this.userTypesAnynomousType[i].Name != 'Owner' || this.userTypesAnynomousType[i].Name != 'Realtor') {
        this.userTypesAnynomousType[i].IsDisabled = true;
      }
    }

    this.profileItemImages = this.ProfileItemImages;
  }

  public chooseRole(userTypeId: number) {
    let selectedUserType: IUserTypeDto = this.UserTypes.filter((x) => x.Id === userTypeId)[0];

    this.IsNewUserTypeSelected = true;
    this.NewSelectedUserTypeId = selectedUserType.Id;

    switch (selectedUserType.Name) {
      case this._constants.UserTypes.Appraiser:
        alert('Not available yet! Subscription required.');
        //this.router.navigate(["dashboard"]);
        break;
      case this._constants.UserTypes.Architect:
        alert('Not available yet! Subscription required.');
        break;
      case this._constants.UserTypes.Bank:
        alert('Not available yet! Subscription required.');
        break;
      case this._constants.UserTypes.Developer:
        alert('Not available yet! Subscription required.');
        //this.router.navigate(["user-types-developer"]);
        break;
      case this._constants.UserTypes.Owner:
        this.router.navigate(["user-types-owner"]);
        break;
      case this._constants.UserTypes.PrivateLabelUser:
        break;
      case this._constants.UserTypes.Realtor:
        this.router.navigate(["user-types-realtor"]);
        break;
      case this._constants.UserTypes.Renter:
        alert('Not available yet! Subscription required.');
        //this.router.navigate(["user-types-renter"]);
        break;
      case this._constants.UserTypes.Tradesman:
        alert('Not available yet! Subscription required.');
        //this.router.navigate(["user-types-tradesman"]);
        break;
      case this._constants.UserTypes.Unassigned:
        break;
      case this._constants.UserTypes.Vendor:
        alert('Not available yet! Subscription required.');
        //this.router.navigate(["user-types-vendor"]);
        break;
    }
  }
}
