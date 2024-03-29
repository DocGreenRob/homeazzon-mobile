import { Component, OnInit } from "@angular/core";
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
import { UtilitiesService } from "../../../../services/utlities/utilities.service";

@Component({
  selector: "app-user-types-manager",
  templateUrl: "./user-types-manager.page.html",
  styleUrls: ["./user-types-manager.page.scss"],
})
export class UserTypesManagerPage extends BasePage {
  public userTypes: Array<IUserTypeDto>;
  public userTypesAnynomousType: Array<any>;
  private _constants: Constants;
  public isIos: boolean = false;

  constructor(public override navController: NavController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override userTypesService: UserTypesService,
    public override featuresService: FeaturesService,
    public override inAppBrowser: InAppBrowser,
    public override storageService: LocalStorageService,
    public utilitiesService: UtilitiesService) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    this._constants = new Constants();

    this.userTypes = this.UserTypes.filter((x) => x.IsActive).filter((x) => x.Name !== this._constants.UserTypes.Unassigned
                                                                          && x.Name !== this._constants.UserTypes.PrivateLabelUser);
    this.userTypesAnynomousType = this.userTypes;

    let currentUserUserTypes: any = this.User.Types;

    for (var i = 0; i < this.userTypesAnynomousType.length; i++) {
      if (currentUserUserTypes.some((x) => x.Name == this.userTypesAnynomousType[i].Name)) {
        this.userTypesAnynomousType[i].IsSubscribed = true;
      } else {
        this.userTypesAnynomousType[i].IsSubscribed = false;
      }
    }

    this.isIos = this.platform.is('ios');
  }

  override ngOnInit() { }

  public close() {
    this.router.navigate(["dashboard"]);
  }

  public setup(userTypeId: number) {
    this.chooseRole(userTypeId, "setup");
  }

  public manage(userTypeId: number) {
    this.chooseRole(userTypeId, "manage");
  }

  public chooseRole(userTypeId: number, action: string) {
    let selectedUserType: IUserTypeDto = this.UserTypes.filter((x) => x.Id === userTypeId)[0];

    this.IsNewUserTypeSelected = true;
    this.NewSelectedUserTypeId = selectedUserType.Id;

    let properties = this.Properties;
    let user = this.User;

    // does user already have this role assigned?
    let isUserTypeAssigned = user.Types.some((x) => x.Id === userTypeId);
    this.NewSelectedUserTypeId = userTypeId;

    const userName = this.getUserName(selectedUserType.Name);

    switch (userName) {
      case this._constants.UserTypes.Appraiser:
        this.router.navigate(["dashboard"]);
        break;
      case this._constants.UserTypes.Architect:
        break;
      case this._constants.UserTypes.Bank:
        break;
      case this._constants.UserTypes.Developer:
        this.router.navigate(["user-types-developer"]);
        break;
      case this._constants.UserTypes.Owner:
        if (isUserTypeAssigned) {
          this.router.navigate(["property-selector"]);
        } else {
          this.router.navigate(["user-types-owner"]);
        }
        break;
      case this._constants.UserTypes.PrivateLabelUser:
        break;
      case this._constants.UserTypes.Realtor:
        this.router.navigate(["user-types-realtor"]);
        break;
      case this._constants.UserTypes.Renter:
        this.router.navigate(["user-types-renter"]);
        break;
      case this._constants.UserTypes.Tradesman:
        this.router.navigate(["user-types-tradesman"]);
        break;
      case this._constants.UserTypes.Unassigned:
        break;
      case this._constants.UserTypes.Vendor:
        this.router.navigate(["user-types-vendor"]);
        break;
    }
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
      imageName = 'appraiser';
    }
    if (userType.toLowerCase().indexOf('architect') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('bank') > -1) {
      imageName = 'bank';
    }
    if (userType.toLowerCase().indexOf('realtor') > -1) {
      imageName = 'realtor';
    }
    if (userType.toLowerCase().indexOf('vendor') > -1) {
      imageName = 'vendor';
    }
    if (userType.toLowerCase().indexOf('gamer') > -1) {
      imageName = 'gamer';
    }
    if (userType.toLowerCase().indexOf('privatelabeluser') > -1) {
      imageName = 'private-label';
    }


    return `assets/icon/${imageName}.svg`;
  }

  getUserName(userName: string) {
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

  public async redirectToRegistrationPage() {
    await this.utilitiesService.getPrivateLabelRegistrationUrl().then((x:any) => {
      let a = x.PrivateLabelRegistrationUrl;
      // redirect the user to the registration URL page www.homeazzon.register.com
      this.inAppBrowser.create(a, "_blank");
    }).catch((err) => {

    });

  }
}
