import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { IRoomTypeDto } from "src/app/models/dto/interfaces/IRoomTypeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-property-profile-bathrooms",
  templateUrl: "./property-profile-bathrooms.page.html",
  styleUrls: ["./property-profile-bathrooms.page.scss"],
})
export class PropertyProfileBathroomsPage extends BasePage {
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
  public isPrivateLabelBuildYourOwn: boolean;
  constants: Constants;

  constructor(
    public navCtrl: NavController,
    public toast: UxNotifierService,
    private loading: UtilitiesService,
    public override router: Router,
    public override platform: Platform,
    private activeRoute: ActivatedRoute,
    private prePreConstruction: PropertyProfilesService
  ) {
    super(navCtrl, null, null, null, null, router, toast, null, null);
    this.constants = new Constants();
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileBathroomsPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileBathroomsPage' });
    this.getBathrooms();
  }

  //get list of bathrooms
  async getBathrooms() {
    let loader = await this.loading.getLoader("getting bathrooms...");
    await loader.present();

    this.prePreConstruction.getAreaTypes("bathroom").then(
      (response: any) => {
        if (response) {
          this.bathRooms = response;
          this.bathRooms.map((item) => {
            item.Quantity = 1;
          });
          loader.dismiss();
        }
      },
      (error) => {
        loader.dismiss();
        this.toast.showToast("Error getting bathrooms!", this.constants.ToastColorBad);
      }
    );
  }

  //increment the quantity
  onBathroomQuantityPlus(bathroom) {
    this.bathRooms.map((item) => {
      if (item.Id == bathroom.Id && item.Quantity < 10) {
        item.Quantity = item.Quantity + 1;
      }
    });
  }

  //decrement the quantity
  onBathroomQuantitySub(bathroom) {
    this.bathRooms.map((item) => {
      if (item.Id == bathroom.Id && item.Quantity > 0) {
        item.Quantity = item.Quantity - 1;
      }
    });
  }

  //go to bathroom page
  continue() {
    let bathroomsDto: Array<IRoomTypeDto> = new Array<IRoomTypeDto>();

    if (this.bathRooms) {
      var bathRoomsQuantity = [];
      let ctr: number = 0;

      this.bathRooms.map((item) => {
        bathRoomsQuantity.push({ Area: { Id: item.Id }, Quantity: item.Quantity });

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

          bathroomsDto.push(x);
          ctr += 1;
        }
        ctr = 0;
      });
    }

    let customProperty: IPropertyDto = this.CustomProperty;
    customProperty.Bathrooms = bathroomsDto;

    this.CustomProperty = customProperty;

    this.router.navigate(["property-profile-interior-areas"]);
  }

  public close() {
    this.navCtrl.pop();
  }
}
