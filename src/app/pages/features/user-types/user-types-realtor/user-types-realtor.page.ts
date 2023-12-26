import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { LoadingController, MenuController, NavController, Platform } from "@ionic/angular";
import { ICompanyInformationDto } from "../../../../models/dto/interfaces/ICompanyInformationDto";
import { IPropertyDto } from "../../../../models/dto/interfaces/IPropertyDto";
import { IStateDto } from "../../../../models/dto/interfaces/IStateDto";
import { CommunicatorService } from "../../../../services/communicator/communicator.service";
import { FeaturesService } from "../../../../services/features/features.service";
import { StaticDataProvider } from "../../../../services/static-data/static-data";
import { UserTypesService } from "../../../../services/user-types/user-types.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { BasePage } from "../../../base/base.page";
import { LocalStorageService } from "@app/services/local-storage.service";
import { CompanyInformationService } from "../../../../services/company-information/company-information.service";
import { Constants } from "../../../../common/Constants";
import { ICompanyTypeDto } from "../../../../models/dto/interfaces/ICompanyTypeDto";

@Component({
  selector: "app-user-types-realtor",
  templateUrl: "./user-types-realtor.page.html",
  styleUrls: ["./user-types-realtor.page.scss"],
})
export class UserTypesRealtorPage extends BasePage {
  public states: Array<IStateDto>;
  selected: boolean = true;
  companyName: string = "";
  website: string = "";
  email: string = "";
  businessPhone: string = "";
  streetAddress1: string = "";
  streetAddress2: string = "";
  city: string = "";
  state: any = 0;
  zip: string = "";
  public isEditingProperty: boolean = false;

  private _isEditingProperty: boolean = false;
  private _constants = new Constants();
  private _loading: any;
  private _selectedProperty: any;
  private _userType: any;

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
    public companyInformationService: CompanyInformationService,
    public loadingController: LoadingController) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    console.log("ionViewDidLoad UserTypesOwnerPage");
    this._constants = new Constants();

    this.staticDataService.getStates().then(
      (x: Array<IStateDto>) => {
        this.states = x;
      },
      (err) => { }
    );
  }

  override async ngOnInit() {
    console.log("ngOnInit UserTypesOwnerPage");

    if (this.User.Types.some((x) => x.Name === 'Realtor')) {
      this._isEditingProperty = true;
    }
    
    this.isEditingProperty = this._isEditingProperty;

    this._userType = this.UserTypes.filter(x => x.Name === 'Realtor')[0];

    if (this._isEditingProperty) {
      this._loading = await this.loadingController.create({
        message: 'Getting Company Information...',
        cssClass: 'my-loading-class',
      });
      await this._loading.present();

      await this.companyInformationService.getCompanyInformationNyUserTypeAsync(this._userType.Id).then((x: ICompanyInformationDto) => {
        this._loading.dismiss();

        this.companyName = x.Name.trim();
        this.website = x.Website ?? '';
        this.email = x.Email ?? '';
        this.businessPhone = x.Phone ?? ''
        this.streetAddress1 = x.StreetAddress1.trim();
        this.streetAddress2 = x.StreetAddress2.trim();
        this.city = x.City.trim();
        this.state = x.State;
        this.zip = x.Zip?.toString()?.trim() || "";
      }).catch((err) => {

      });
    }
  }

  ionViewWillLoad() { }

  public async continue() {
    this.companyName = this.companyName.trim();
    this.website = this.website.trim();
    this.email = this.email.trim();
    this.businessPhone = this.businessPhone.trim();
    this.streetAddress1 = this.streetAddress1.trim();
    this.streetAddress2 = this.streetAddress2.trim();
    this.city = this.city.trim();
    this.zip = this.zip?.toString()?.trim() || "";

    if (this.companyName === ""
      || this.email === ""
      || this.businessPhone === ""
      || this.streetAddress1 === ""
      || this.city === ""
      || this.state === ""
      || this.zip === "") {
      let errors: Array<string> = new Array<string>();

      if (this.companyName === "") {
        errors.push("Company Name");
      }
      if (this.email === "") {
        errors.push("Email");
      }
      if (this.businessPhone === "") {
        errors.push("Business Phone");
      }
      if (this.streetAddress1 === "") {
        errors.push("StreetAddress1");
      }
      if (this.city === "") {
        errors.push("City");
      }
      if (this.state === "") {
        errors.push("State");
      }
      if (this.zip === "") {
        errors.push("Zip");
      }

      this.uxNotifierService.presentSimpleAlert(`Missing Fields! (${errors.join(", ")})`, "");
    } else {
      let customProperty: IPropertyDto = {} as IPropertyDto;
      let realtor: ICompanyInformationDto = {} as ICompanyInformationDto;

      realtor.Name = this.companyName;
      realtor.Website = this.website;
      realtor.Email = this.email;
      realtor.Phone = this.businessPhone;
      realtor.StreetAddress1 = this.streetAddress1;
      realtor.StreetAddress2 = this.streetAddress2;
      realtor.City = this.city;
      realtor.State = this.state;
      realtor.Zip = this.zip;
      realtor.Type = {
        Id: this._userType.Id,
        Name: this._userType.Name
      } as ICompanyTypeDto;

      this.CompanyInformation = realtor;
      this.CustomProperty = customProperty;

      if (this._isEditingProperty) {
        await this.save(realtor);
      } else {
        this.router.navigate(["property-profile-general-information"]);
      }

    }
  }

  public async save(realtor: ICompanyInformationDto) {
    this._loading = await this.loadingController.create({
      message: 'Updating Company Information...',
      cssClass: 'my-loading-class',
    });
    await this._loading.present();

    await this.companyInformationService.upsertCompanyInformationAsync(realtor).then((x) => {
      this._loading.dismiss();
      this.uxNotifierService.showToast("Company Information updated.", this._constants.ToastColorGood);
      this.router.navigate(["dashboard"]);
    }).catch((err) => {
      this.uxNotifierService.showToast("Company Information not updated!", this._constants.ToastColorBad);
    });
  }

  public async manageProperties() {
    this.router.navigate(["property-selector"]);
  }

  public close() {
    this.location.back();
  }
}
