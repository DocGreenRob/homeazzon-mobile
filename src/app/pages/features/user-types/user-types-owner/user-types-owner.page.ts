import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { MenuController, ModalController, NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { IAddressDto } from "../../../../models/dto/interfaces/IAddressDto";
import { CommunicatorService } from "../../../../services/communicator/communicator.service";
import { FeaturesService } from "../../../../services/features/features.service";
import { UserTypesService } from "../../../../services/user-types/user-types.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { BasePage } from "../../../base/base.page";
import { Constants } from "../../../../common/Constants";
import { Country, State, City } from 'country-state-city';

@Component({
  selector: "app-user-types-owner",
  templateUrl: "./user-types-owner.page.html",
  styleUrls: ["./user-types-owner.page.scss"],
})
export class UserTypesOwnerPage extends BasePage implements OnInit {
  public selected: boolean = true;
  public country: string = "";
  public streetAddress1: string = "";
  public streetAddress2: string = "";
  public city: string = "";
  public state: any = "";
  public zip: string = "";
  public isPublicProperty: boolean = false;
  public title: string = 'Owner Registration';
  public isOwner: boolean = false;
  public cities: any[] = [];
  public states: any[] = [];
  public countries = Country.getAllCountries();
  public isIos: boolean = false;
  filteredCountries = this.countries;
  filteredstates = this.states;
  filteredcities = this.cities;
  searchTerm: string = '';
  private _isEditingProperty: boolean = false;
  private _selectedProperty: any;
  private _constants: Constants;
  countrycode = "";
  statecode = "";

  constructor(public override navController: NavController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override userTypesService: UserTypesService,
    public override featuresService: FeaturesService,
    public override inAppBrowser: InAppBrowser,
    private location: Location,
    public override storageService: LocalStorageService,
    public modal: ModalController,
    private storage: Storage) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    console.log("ionViewDidLoad UserTypesOwnerPage");

    this._constants = new Constants();

    this.updateTitle();

    this.isIos = this.platform.is('ios');
  }

  override ngOnInit() {
    console.log("ngOnInit UserTypesOwnerPage");
    this._isEditingProperty = this.IsEditingProperty ?? false;

    if (this._isEditingProperty) {
      this._selectedProperty = this.SelectedProperty;

      this.streetAddress1 = this._selectedProperty.StreetAddress1;
      this.streetAddress2 = this._selectedProperty.StreetAddress2;
      this.country = this._selectedProperty.Country;
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
    this.streetAddress1 = this.streetAddress1?.trim() || '';
    this.streetAddress2 = this.streetAddress2?.trim() || '';
    this.city = this.city?.trim() || '';
    this.zip = this.zip?.toString()?.trim() || "";

    let a = this.SelectedProperty;
    if (this._isEditingProperty) {
      a.IsPublicProperty = this.isPublicProperty;
    }
    this.SelectedProperty = a;

    if (this.streetAddress1 == "" || (this.cities.length && this.city == "") || (this.states.length && this.state == "") || this.zip == "") {
      this.uxNotifierService.presentSimpleAlert("All fields are required!", "");
    } else {
      let customProperty: any = {};
      let address: IAddressDto = {} as IAddressDto;
      address.StreetAddress1 = this.streetAddress1;
      address.StreetAddress2 = this.streetAddress2;
      address.Country = this.country;
      address.CountryCode = this.countrycode;
      address.City = this.city;
      address.State = this.state;
      address.StateCode = this.statecode;
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

  private updateTitle() {
    const userName = this.getUserName(this.NewSelectedUserType.Name);
    let a = this.IsNewUserTypeSelected;
    let b: boolean = false;

    if (a != undefined && a != null) {
      b = a;
    }

    switch (userName) {
      case 'Owner':
        this.title = b ? 'Create Property' : 'Update Property';
        this.isOwner = true;
        break;
      case 'Realtor':
        this.title = b ? 'Create Property' : 'Update Property';
        break;
    }
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

  filterCountry(event: CustomEvent) {
    this.searchTerm = event.detail.value;
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterState(event: CustomEvent) {
    this.searchTerm = event.detail.value;
    this.filteredstates = this.states.filter(state =>
      state.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterCity(event: CustomEvent) {
    this.searchTerm = event.detail.value;
    this.filteredcities = this.cities.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectCountry(country, councode) {
    this.searchTerm = '';
    this.filteredCountries = this.countries;
    this.country = country.name;
    this.countrycode = councode;
    this.modal.dismiss();
    this.onCountryChange(councode);
  }

  selectstate(state, statecode) {
    this.searchTerm = '';
    this.filteredstates = this.states;
    this.state = state.name;
    this.statecode = statecode;
    this.modal.dismiss();
    this.onStateChange(statecode);
  }

  selectcity(city) {
    this.searchTerm = '';
    this.filteredcities = this.cities;
    this.city = city.name;
    this.city = '';
    this.modal.dismiss();
  }

  onCountryChange(code) {
    this.states = State.getStatesOfCountry(code);
    this.filteredstates = this.states;
    this.state = '';
    this.city = '';
    this.modal.dismiss();
  }

  onStateChange(code) {
    this.cities = City.getCitiesOfState(this.countrycode, code);
    this.filteredcities = this.cities;
  }
}
