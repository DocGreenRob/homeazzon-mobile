import { Component, OnInit } from "@angular/core";
import { BasePage } from "src/app/pages/base/base.page";
import { Platform, NavController } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { Storage } from "@ionic/storage";
import { Constants } from "src/app/common/Constants";
import { IRoomTypeDto } from "src/app/models/dto/interfaces/IRoomTypeDto";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-property-profile-bedrooms",
  templateUrl: "./property-profile-bedrooms.page.html",
  styleUrls: ["./property-profile-bedrooms.page.scss"],
})
export class PropertyProfileBedroomsPage extends BasePage {
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
  constants: Constants;
  public isPrivateLabelBuildYourOwn: boolean = false;
  public isIos: boolean = false;
  spinnerText: string;
  loadingVisible: boolean;

  constructor(public navCtrl: NavController,
              private toast: UxNotifierService,
              private loading: UtilitiesService,
              public override platform: Platform,
              public override router: Router,
              private activeRoute: ActivatedRoute,
              private prePreConstruction: PropertyProfilesService,
              public override storageService: LocalStorageService) {
    super(navCtrl, null, null, null, platform, router, null, null, null, null, storageService);
    this.constants = new Constants();
    this.isIos = this.platform.is('ios');
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileBedroomsPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileBedroomsPage' });
    this.getBedrooms();
  }

  //get list of bedrooms
  async getBedrooms() {
    this.presentSpinner("getting bedrooms...");

    await this.prePreConstruction.getAreaTypes("bedroom").then(
      (response: any) => {
        if (response) {
          this.bedRooms = response;
          this.bedRooms.map((item) => {
            item.Quantity = 1;
          });
          this.dismissSpinner();
        }
      },
      (error) => {
        this.dismissSpinner();
        this.toast.showToast("Server Error!", this.constants.ToastColorBad);
        console.log(error);
      }
    );
  }

  //go to bathroom page
  continue() {
    let bedroomsDto: Array<IRoomTypeDto> = new Array<IRoomTypeDto>();

    if (this.bedRooms) {
      var bedRoomsQuantity = [];
      let ctr: number = 0;
      this.bedRooms.map((item) => {
        bedRoomsQuantity.push({ Area: { Id: item.Id }, Quantity: item.Quantity });

        for (let i = 0; i < item.Quantity; i++) {
          let x: IRoomTypeDto = {} as IRoomTypeDto;
          x.Id = 0;
          x.SqFt = 0;
          x.AreaId = item.Id;

          if (ctr === 0) {
            x.Name = item.Name;
          } else {
            x.Name = `${item.Name} ${ctr}`;
          }

          bedroomsDto.push(x);
          ctr += 1;
        }
        ctr = 0;
      });
    }

    let customProperty: IPropertyDto = this.CustomProperty;
    customProperty.Bedrooms = bedroomsDto;

    this.CustomProperty = customProperty;

    this.router.navigate(["property-profile-bathrooms"]);
  }

  public close() {
    this.navCtrl.pop();
  }

  goBack() {
    this.navController.back();
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
