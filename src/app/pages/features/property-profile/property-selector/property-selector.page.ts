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
    let a = this.Properties;
    this.properties = a.filter((x) => x.UserTypeId === this.NewSelectedUserTypeId);

    let b = this.User;
    this.isOwner = b.Types.some((x) => x.Id === this.NewSelectedUserTypeId && x.Name === 'Owner');
    this.isRealtor = b.Types.some((x) => x.Id === this.NewSelectedUserTypeId && x.Name === 'Realtor');
  }

  public close() {
    this.location.back();
  }

  public editProperty(property) {
    this.SelectedProperty = property;
    this.IsEditingProperty = true;
    let selectedPropertyUserType: IUserTypeDto = this.UserTypes.filter((x) => x.Id === property.UserTypeId)[0];

    switch (selectedPropertyUserType.Name) {
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
