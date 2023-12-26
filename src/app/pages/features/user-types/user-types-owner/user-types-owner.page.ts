import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { MenuController, NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { IAddressDto } from "../../../../models/dto/interfaces/IAddressDto";
import { IStateDto } from "../../../../models/dto/interfaces/IStateDto";
import { CommunicatorService } from "../../../../services/communicator/communicator.service";
import { FeaturesService } from "../../../../services/features/features.service";
import { StaticDataProvider } from "../../../../services/static-data/static-data";
import { UserTypesService } from "../../../../services/user-types/user-types.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { BasePage } from "../../../base/base.page";

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
  public isPublicProperty: boolean = false;
  public title: string = 'Owner Registration';
  public isOwner: boolean = false;

  private _isEditingProperty: boolean = false;
  private _selectedProperty: any;


  constructor(public override navController: NavController,
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
    private storage: Storage) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    console.log("ionViewDidLoad UserTypesOwnerPage");

    this.staticDataService.getStates().then(
      (x: Array<IStateDto>) => {
        this.states = x;
      },
      (err) => { }
    );

    this.updateTitle();
  }

  private updateTitle() {
    switch (this.NewSelectedUserType.Name) {
      case 'Owner':
        this.title = 'Update Property';
        this.isOwner = true;
        break;
      case 'Realtor':
        this.title = 'Update Property';
        break;
    }
  }

  override async ngOnInit() {
    console.log("ngOnInit UserTypesOwnerPage");
    this._isEditingProperty = this.IsEditingProperty; // await this.storageService.get("IsEditingProperty");

    if (this._isEditingProperty) {
      // TODO: Need to refactor the property to have the structure of IPropertyDto
      /*
      let p: IPropertyDto = this.SelectedProperty;

      this.streetAddress1 = p.Address.StreetAddress1;
      this.streetAddress2 = p.Address.StreetAddress2;
      this.city = p.Address.City;
      this.state = p.Address.State;
      this.zip = p.Address.Zip;
      */
      this._selectedProperty = this.SelectedProperty;

      this.streetAddress1 = this._selectedProperty.StreetAddress1;
      this.streetAddress2 = this._selectedProperty.StreetAddress2;
      this.city = this._selectedProperty.City;
      this.state = this._selectedProperty.State;
      this.zip = this._selectedProperty.Zip;
      this.isPublicProperty = this._selectedProperty.IsPublicProperty;
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

    // TODO: Need to refactor, temp solution, blah blah
    let a = this.SelectedProperty;
    a.IsPublicProperty = this.isPublicProperty;
    this.SelectedProperty = a;

    if (this.streetAddress1 == "" || this.city == "" || this.state == "" || this.zip == "") {
      this.uxNotifierService.presentSimpleAlert("All fields are required!", "");
    } else {
      //let customProperty: IPropertyDto = {} as IPropertyDto;
      let customProperty: any = {};
      let address: IAddressDto = {} as IAddressDto;
      address.StreetAddress1 = this.streetAddress1;
      address.StreetAddress2 = this.streetAddress2;
      address.City = this.city;
      address.State = this.state;
      address.Zip = this.zip;
      customProperty.IsPublicProperty = this.isPublicProperty;

      customProperty.Address = address;
      this.storageService.set("CustomProperty", customProperty);

      this.router.navigate(["property-profile-general-information"]);
    }
  }

  public close() {
    this.location.back();
  }
}
