import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { IRoomTypeDto } from "src/app/models/dto/interfaces/IRoomTypeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { AddRoomModalPage } from "src/app/pages/modals/add-room-modal/add-room-modal.page";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-property-profile-interior-areas",
  templateUrl: "./property-profile-interior-areas.page.html",
  styleUrls: ["./property-profile-interior-areas.page.scss"],
})
export class PropertyProfileInteriorAreasPage extends BasePage {
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
  constants: Constants;
  public isPrivateLabelBuildYourOwn: boolean;
  @ViewChild("content") private content: any;

  constructor(
    public navCtrl: NavController,
    private toast: UxNotifierService,
    private loading: UtilitiesService,
    private modalController: ModalController,
    public override router: Router,
    public override platform: Platform,
    private activeRoute: ActivatedRoute,
    private prePreConstruction: PropertyProfilesService
  ) {
    super(navCtrl, null, null, null, platform, router, null, null, null);
    this.constants = new Constants();
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileInteriorAreasPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileInteriorAreasPage' });
    this.getInteriors();
  }

  //get list of interior areas
  async getInteriors() {
    let loader = await this.loading.getLoader("getting interior...");
    await loader.present();

    await this.prePreConstruction.getAreaTypes("interior").then(
      (response: any) => {
        if (response) {
          console.log("interiors", response);
          this.interiors = response;
          this.interiors.map((item) => {
            item.Quantity = 0;
          });
          loader.dismiss();
        }
      },
      (error) => {
        loader.dismiss();
        this.toast.showToast("Error getting interior areas!", this.constants.ToastColorBad);
        console.log(error);
      }
    );
  }

  //go to exterior area page
  continue() {
    let interiorAreasDto: Array<IRoomTypeDto> = new Array<IRoomTypeDto>();

    if (!this.checkInteriorQuantity()) {
      this.toast.presentSimpleAlert("Please add at least one Common area", "");
    } else {
      if (this.interiors) {
        var interiorQuantity = [];
        this.interiors.map((item) => {
          interiorQuantity.push({ Area: { Id: item.Id }, Quantity: item.Quantity });

          for (let i = 0; i < item.Quantity; i++) {
            let x: IRoomTypeDto = {} as IRoomTypeDto;
            x.Id = 0;
            x.SqFt = item.SqFt || 0;
            x.AreaId = item.Id;
            x.Name = item.Name;
            interiorAreasDto.push(x);
          }
        });
      }

      let customProperty: IPropertyDto = this.CustomProperty;
      customProperty.InteriorAreas = interiorAreasDto;

      this.CustomProperty = customProperty;

      this.router.navigate(["property-profile-exterior-areas"]);
    }
  }

  async addRoom() {
    let addRoomModal = await this.modalController.create({
      component: AddRoomModalPage,
      componentProps: { areas: this.interiors, areaTypeName: "Common Areas", UiType: "customHouse" },
      cssClass: "small-modal",
    });
    await addRoomModal.present();
    await addRoomModal.onDidDismiss().then((data: any) => {
      if (data != null && data != undefined) {
        this.interiors.push({ Id: 0, Name: data.data.Name, Quantity: 1, SqFt: data.data.sqFt });

        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
      }
    });
  }

  scrollToBottom() {
    this.content.scrollToBottom(300);
  }

  checkInteriorQuantity() {
    for (let interior of this.interiors) {
      if (interior.Quantity > 0) {
        return true;
      }
    }
    return false;
  }

  public close() {
    this.navCtrl.pop();
  }
}
