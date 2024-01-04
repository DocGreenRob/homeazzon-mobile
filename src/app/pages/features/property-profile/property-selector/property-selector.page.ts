import { Location } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../../common/Constants';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { LoadingController, Platform } from '@ionic/angular';
import { NotificationService } from '../../../../services/notification/notification.service';
import { UxNotifierService } from '../../../../services/uxNotifier/ux-notifier.service';
import { BasePage } from '../../../base/base.page';
import { IUserTypeDto } from "../../../../models/dto/interfaces/IUserTypeDto";
import { Router } from "@angular/router";

@Component({
  selector: 'app-property-selector',
  templateUrl: './property-selector.page.html',
  styleUrls: ['./property-selector.page.scss'],
})
export class PropertySelectorPage extends BasePage {
  private _constants: Constants;
  private _loading: any;

  public properties: any;
  public isOwner: boolean = false;
  public isRealtor: boolean = false;

  constructor(public override storageService: LocalStorageService,
    private location: Location,
    private loadingController: LoadingController,
    private notificationService: NotificationService,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform,
    public override router: Router,) {
    super(null,
      null,
      null,
      null,
      platform,
      router,
      uxNotifierService,
      null,
      null,
      null,
      storageService);

    this._constants = new Constants();
  }

  override async ngOnInit() {
    let userTypeForSelectedProperty = this.User.Types.filter((x) => x.Id === this.NewSelectedUserTypeId)[0];
    let a = this.Properties;
    this.properties = a.filter((x) => x.UserTypeId === this.NewSelectedUserTypeId);
    this.properties.forEach((x) => {
      const imageName = this.getImageName(userTypeForSelectedProperty.Name.toLowerCase());
      x.Image = `assets/icon/${imageName}.svg`;
    });
    let b = this.User;

    this.isOwner = b.Types.some((x) => x.Id === this.NewSelectedUserTypeId && x.Name === 'Owner');
    this.isRealtor = b.Types.some((x) => x.Id === this.NewSelectedUserTypeId && x.Name === 'Realtor');
  }

  private setPropertyImage(userType: string, property: any) {
    const imageName = this.getImageName(userType);
    property.Image = `assets/icon/${imageName}.svg`;
  }

  public close() {
    this.location.back();
  }

  public editProperty(property) {
    this.SelectedProperty = property;
    this.IsEditingProperty = true;
    let selectedPropertyUserType: IUserTypeDto = this.UserTypes.filter((x) => x.Id === property.UserTypeId)[0];

    if (this.IsEditingProperty) {
      this.NewSelectedUserType = selectedPropertyUserType;

      // Using the Owner route because the user's intention
      // here is only to update the address and property name
      // so we will reuse this flow and set a flag knowing
      // which patch we are traversing
      this.router.navigate(["user-types-owner"]);

    } else {
      const userName = this.getUserName(selectedPropertyUserType.Name);

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
          this.router.navigate(["user-types-owner"]);
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

  }

  getImageName(userType: string) {
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

    return imageName;
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
}
