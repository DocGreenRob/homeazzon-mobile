import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { IRoomTypeDto } from "src/app/models/dto/interfaces/IRoomTypeDto";
import { IUserDto } from "src/app/models/dto/interfaces/IUserDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { UserDetailsService } from "src/app/services/user-details/user-details.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { IUserTypeDto } from "../../../../models/dto/interfaces/IUserTypeDto";
import { AccountService } from "../../../../services/account/account.service";
import { CacheService } from "../../../../services/cache/cache.service";
import { CompanyInformationService } from "../../../../services/company-information/company-information.service";
import { UserTypesService } from "../../../../services/user-types/user-types.service";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-property-profile-exterior-areas",
  templateUrl: "./property-profile-exterior-areas.page.html",
  styleUrls: ["./property-profile-exterior-areas.page.scss"],
})
export class PropertyProfileExteriorAreasPage extends BasePage {
  userId: any;
  userTypeId: any;
  CurrentUser: any;
  exteriors: any;
  exteriorsChecked: any = [];
  interiors: any;
  bathRooms: any;
  bedRooms: any;
  customerName: any;
  customerEmail: any;
  availableUserType: any;
  propertyNicName: any;
  flag: any;
  streetAddress1: any;
  streetAddress2: any;
  city: any;
  state: any;
  zip: any;
  profiles: any = [];
  constants: Constants;
  profileId: any;
  labellotsprofiles: any;
  public isPrivateLabelBuildYourOwn: boolean;
  public isSkipExteriorAreas: boolean = false;
  public isIos: boolean = false;
  spinnerText: string;
  loadingVisible: boolean;

  constructor(
    public navCtrl: NavController,
    public toast: UxNotifierService,
    private loading: UtilitiesService,
    private alertCtrl: AlertController,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    private prePreConstruction: PropertyProfilesService,
    private privatelabelService: PrivateLabelService,
    private userService: UserDetailsService,
    private cacheService: CacheService,
    public override userTypesService: UserTypesService,
    private accountService: AccountService,
    private companyInformationService: CompanyInformationService,
    public override storageService: LocalStorageService
  ) {
    super(navCtrl, null, null, null, platform, router, toast, null, null, null, storageService);
    this.constants = new Constants();

    this.isIos = this.platform.is('ios');
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileExteriorAreasPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileExteriorAreasPage' });
    this.getExteriors();
  }

  //get list of exterior areas
  async getExteriors() {
    this.presentSpinner("getting exterior areas ...");

    await this.prePreConstruction.getAreaTypes("exterior").then(
      (response: any) => {
        if (response) {
          console.log("exteriors", response);
          this.exteriors = response;

          this.dismissSpinner();
        }
      },
      (error) => {
        this.dismissSpinner();
        this.toast.showToast("Error getting exterior areas!", this.constants.ToastColorBad);
        console.log(error);
      }
    );
  }

  //select multiple exteriors
  addCheckbox(event, checkbox: any) {
    if (event.target.checked) {
      this.exteriorsChecked.push(checkbox);
    } else {
      let index = this.removeCheckedFromArray(checkbox);
      this.exteriorsChecked.splice(index, 1);
    }
  }

  //Removes checkbox from array when you un check it
  removeCheckedFromArray(checkbox: String) {
    return this.exteriorsChecked.findIndex((category) => {
      return category === checkbox;
    });
  }

  //this method show the confirm alert
  async confirmAlert() {
    const confirm = await this.alertCtrl.create({
      header: "",
      message: "Do you want to add another profile(property)?",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("No clicked");
            this.router.navigate(["dashboard"]);
          },
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Yes clicked");
            // property-profile-general-information
            this.router.navigate(["property-profile-general-information"]);
            //this.router.navigate(["property-profile-address"]);
          },
        },
      ],
    });
    confirm.present();
  }

  //go to home screen
  gotoHome() {
    this.router.navigate(["dashboard"]);
  }

  async getPrivateLabelLotsProfile() {
    this.presentSpinner("getting label profile list...");

    await this.privatelabelService.getPrivateLabellotsprofile(this.profileId).subscribe(
      (response: any) => {
        if (response) {
          console.log("labellotsprofile", response);
          this.labellotsprofiles = response;
          this.dismissSpinner();
        }
      },
      (error) => {
        this.dismissSpinner();
        console.log(error);
      }
    );
  }

  private async setExteriorAreas() {
    if (this.exteriorsChecked.length == 0) {
      //this.toast.presentSimpleAlert('Please select at least one', '');
    } else {
      let exteriorAreasDto: Array<IRoomTypeDto> = new Array<IRoomTypeDto>();

      this.exteriorsChecked.map((item) => {
        let name: string = this.exteriors.filter((x) => x.Id === item)[0].Name;
        let x: IRoomTypeDto = {} as IRoomTypeDto;
        x.AreaId = item;
        x.Name = name;
        exteriorAreasDto.push(x);
      });

      let customProperty: IPropertyDto = this.CustomProperty;
      customProperty.ExteriorAreas = exteriorAreasDto;
      this.CustomProperty = customProperty;
    }
  }

  async saveProperty() {
    this.presentSpinner("saving property ...");
    await this.setExteriorAreas();

    let customProperty: IPropertyDto = this.CustomProperty;
    customProperty.User = {} as IUserDto;
    // debugger;
    customProperty.User.Email = this.User.Email;
    customProperty.User.Id = this.User.Id;
    customProperty.User.Types = new Array<IUserTypeDto>();
    customProperty.UserTypeId = this.NewSelectedUserTypeId;

    //debugger;
    // determine if need to save Company Information
    let _ = this.UserTypes.filter(x => x.Name.toLowerCase().indexOf(this.constants.UserTypes.Unassigned.toLowerCase()) < 0
      && x.Name.toLowerCase().indexOf(this.constants.UserTypes.Owner.toLowerCase()) < 0);

    if (_.some(x => x.Id === this.NewSelectedUserTypeId)) {
      // figure out which type to do custom stuff???

      var c = this.UserTypes.filter(x => x.Id == this.NewSelectedUserTypeId)[0].Name;

      let _t = {
        Id: this.NewSelectedUserTypeId,
        Name: c
      };

      this.CompanyInformation.Type = _t;
      let x = this.CompanyInformation;
      x.Type = _t;
      this.CompanyInformation = x;

      this.companyInformationService
        .upsertCompanyInformationAsync(this.CompanyInformation)
        .then((x) => {
          this.CompanyInformation = x;
        })
        .catch((e) => { });
    }

    if (this.IsNewUserTypeSelected === true) {
      this.userTypesService
        .saveNewUserType(this.NewSelectedUserTypeId)
        .then(async (i) => {
          this.accountService
            .getUser()
            .then(async (x: IUserDto) => {
              this.User = x;

              customProperty.UserTypeId = this.NewSelectedUserTypeId;

              this.IsNewUserTypeSelected = false;
              this.NewSelectedUserTypeId = 0;

              await this.save(customProperty);
            })
            .catch((e) => { });
        })
        .catch((e) => { });
    } else {
      // TODO: Need to prompt user for UserType for new property
      customProperty.UserTypeId = this.User.Types[0].Id;
      await this.save(customProperty);
    }
  }

  private async save(customProperty: IPropertyDto) {

    this.privatelabelService.saveCustomPropertyAsync(customProperty).then(
      async (savedProperty: any) => {
        this.dismissSpinner();
        this.closeAfterSave();

        //this.UserTypes.forEach(async (x) => {
        //	this.cacheService.updateProperty(savedProperty.Id, x.Id);
        //});
        //TODO:
        // does "await" actually wait until getting response before sending next call?
      },
      (err) => {
        this.dismissSpinner();
      }
    );
  }

  public close() {
    this.navCtrl.pop();
  }

  public closeAfterSave() {
    let navExtras: NavigationExtras = {
      queryParams: {
        updatePropertyCache: true,
      },
    };
    this.router.navigate(["dashboard"], navExtras);
  }

  goBack() {
    this.navController.back();
  }
  showExterior() {
    this.isSkipExteriorAreas = !this.isSkipExteriorAreas;
  }

  async presentSpinner(text: string) {
    this.spinnerText = text;
    this.loadingVisible = true;
  }
  async dismissSpinner() {
    this.loadingVisible = false;
    this.spinnerText = '';
  }
}
