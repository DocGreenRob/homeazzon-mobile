import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { MenuController, NavController, Platform } from "@ionic/angular";
import { IAddressDto } from "../../../../models/dto/interfaces/IAddressDto";
import { IPropertyDto } from "../../../../models/dto/interfaces/IPropertyDto";
import { IStateDto } from "../../../../models/dto/interfaces/IStateDto";
import { CommunicatorService } from "../../../../services/communicator/communicator.service";
import { FeaturesService } from "../../../../services/features/features.service";
import { StaticDataProvider } from "../../../../services/static-data/static-data";
import { UserTypesService } from "../../../../services/user-types/user-types.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { BasePage } from "../../../base/base.page";
import { LocalStorageService } from "@app/services/local-storage.service";
import { Storage } from "@ionic/storage";
import { PropertyService } from "../../../../services/property/property.service";
import { Constants } from "../../../../common/Constants";

@Component({
  selector: "app-user-types-owner",
  templateUrl: "./user-types-owner.page.html",
  styleUrls: ["./user-types-owner.page.scss"],
})
export class UserTypesOwnerPage extends BasePage {
  public states: Array<IStateDto>;
  public selected: boolean = true;
  public streetAddress1: string = "";
  public streetAddress2: string = "";
  public city: string = "";
  public state: any = 0;
  public zip: string = "";

  private _isEditingProperty: boolean = false;
  private _constants: Constants;

  constructor(
    public override navController: NavController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override userTypesService: UserTypesService,
    public override featuresService: FeaturesService,
    public override inAppBrowser: InAppBrowser,
    private staticDataService: StaticDataProvider,
    private location: Location,
    public override storageService: LocalStorageService,
    private storage: Storage,
    private propertyService: PropertyService
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    console.log("ionViewDidLoad UserTypesOwnerPage");

    this.staticDataService.getStates().then(
      (x: Array<IStateDto>) => {
        this.states = x;
      },
      (err) => { }
    );
  }

  override async ngOnInit() {
    console.log("ngOnInit UserTypesOwnerPage");
    this._isEditingProperty = this.IsEditingProperty; // await this.storageService.get("IsEditingProperty");

    if (this._isEditingProperty) {
      let p = this.SelectedProperty;

      this.streetAddress1 = p.Address.StreetAddress1;
      this.streetAddress2 = p.Address.StreetAddress2;
      this.city = p.Address.City;
      this.state = p.Address.State;
      this.zip = p.Address.Zip;
    }
  }

  ionViewWillLoad() { }

  goToBuildYourGeneral() {
    this.storage.remove("SelectedPrivateLabelerProperty").then(
      (x) => {
        this.router.navigate(["property-profile-general-information"]);
      },
      (err) => { }
    );
  }

  async continue() {
    this.streetAddress1 = this.streetAddress1.trim();
    this.streetAddress2 = this.streetAddress2.trim();
    this.city = this.city.trim();
    this.zip = this.zip?.toString()?.trim() || "";

    if (this.streetAddress1 == "" || this.city == "" || this.state == "" || this.zip == "") {
      this.uxNotifierService.presentSimpleAlert("All fields are required!", "");
    } else {
      let customProperty: IPropertyDto = {} as IPropertyDto;
      let address: IAddressDto = {} as IAddressDto;
      address.StreetAddress1 = this.streetAddress1;
      address.StreetAddress2 = this.streetAddress2;
      address.City = this.city;
      address.State = this.state;
      address.Zip = this.zip;
      customProperty.Address = address;
      this.storageService.set("CustomProperty", customProperty);

      if (this._isEditingProperty) {
        // save property address information
        await this.propertyService.updateAddress(customProperty).then((x) => {
          this.uxNotifierService.showToast("Address updated.", this._constants.ToastColorGood);
          // go to dashboard
          this.router.navigate(["dashboard"]);
        }).catch((err) => {
          this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
        });
      } else {
        this.router.navigate(["property-profile-general-information"]);
      }

    }
  }

  public close() {
    this.location.back();
  }
}
