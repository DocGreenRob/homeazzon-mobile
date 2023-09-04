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

  constructor(
    public navCtrl: NavController,
    private toast: UxNotifierService,
    private loading: UtilitiesService,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    private prePreConstruction: PropertyProfilesService
  ) {
    super(navCtrl, null, null, null, platform, router, null, null, null);
    this.constants = new Constants();
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileBedroomsPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileBedroomsPage' });
    this.getBedrooms();
  }

  //get list of bedrooms
  async getBedrooms() {
    let loader = await this.loading.getLoader("getting bedrooms...");
    await loader.present();

    await this.prePreConstruction.getAreaTypes("bedroom").then(
      (response: any) => {
        if (response) {
          this.bedRooms = response;
          this.bedRooms.map((item) => {
            item.Quantity = 1;
          });
          loader.dismiss();
        }
      },
      (error) => {
        loader.dismiss();
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
}
