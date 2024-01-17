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

  constructor(public override navController: NavController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override userTypesService: UserTypesService,
    public override inAppBrowser: InAppBrowser,
    public override featuresService: FeaturesService,
    public override storageService: LocalStorageService) {
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

      if (this.userTypesAnynomousType[i].Name.toLowerCase().indexOf('owner') < 0 || this.userTypesAnynomousType[i].Name.toLowerCase().indexOf('realtor')) {
        this.userTypesAnynomousType[i].IsDisabled = true;
      }
    }

    this.profileItemImages = this.ProfileItemImages;
  }

  public chooseRole(userTypeId: number) {
    let selectedUserType: IUserTypeDto = this.UserTypes.filter((x) => x.Id === userTypeId)[0];

    this.IsNewUserTypeSelected = true;
    this.NewSelectedUserTypeId = selectedUserType.Id;
    this.NewSelectedUserType = selectedUserType;

    const userTypeName = this.getUserName(selectedUserType.Name);

    switch (userTypeName) {
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

  public isUserTypeEnabled(userType: string) {
    const userTypeName = this.getUserName(userType);

    switch (userTypeName) {
      case this._constants.UserTypes.Appraiser:
      case this._constants.UserTypes.Architect:
      case this._constants.UserTypes.Bank:
      case this._constants.UserTypes.Developer:
      case this._constants.UserTypes.Tradesman:
      case this._constants.UserTypes.Vendor:
      case this._constants.UserTypes.PrivateLabelUser:
        return false;
      case this._constants.UserTypes.Owner:
      case this._constants.UserTypes.Realtor:
      case this._constants.UserTypes.Renter:
        return true;
    }

    return false;
  }

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

  getImagePath(userType: string) {
    var imageName: string = '';

    if (userType.toLowerCase().indexOf('tradesman') > -1) {
      imageName = 'tradesman';
    }
    if (userType.toLowerCase().indexOf('owner') > -1) {
      imageName = 'owner';
    }
    if (userType.toLowerCase().indexOf('developer') > -1) {
      imageName = 'developer';
    }
    if (userType.toLowerCase().indexOf('appraiser') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('architect') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('bank') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('realtor') > -1) {
      imageName = 'realtor';
    }
    if (userType.toLowerCase().indexOf('vendor') > -1) {
      imageName = 'vendor';
    }

    return `assets/icon/${imageName}.svg`;
  }
}
