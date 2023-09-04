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

@Component({
  selector: "app-user-types-owner",
  templateUrl: "./user-types-owner.page.html",
  styleUrls: ["./user-types-owner.page.scss"],
})
export class UserTypesOwnerPage extends BasePage {
  public states: Array<IStateDto>;
  selected: boolean = true;
  streetAddress1: string = "";
  streetAddress2: string = "";
  city: string = "";
  state: any = 0;
  zip: string = "";

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
    private location: Location
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser);
    console.log("ionViewDidLoad UserTypesOwnerPage");

    this.staticDataService.getStates().then(
      (x: Array<IStateDto>) => {
        this.states = x;
      },
      (err) => {}
    );
  }

  override async ngOnInit() {
    console.log("ngOnInit UserTypesOwnerPage");
  }
  ionViewWillLoad() {}

  continue() {
    this.streetAddress1 = this.streetAddress1.trim();
    this.streetAddress2 = this.streetAddress2.trim();
    this.city = this.city.trim();
    this.zip = this.zip.toString().trim();

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
      localStorage.setItem("CustomProperty", JSON.stringify(customProperty));
      this.router.navigate(["property-profile-general-information"]);
    }
  }

  public close() {
    this.location.back();
  }
}
