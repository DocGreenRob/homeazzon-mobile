import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { BasePage } from "src/app/pages/base/base.page";
import { IAddressDto } from "../../../../models/dto/interfaces/IAddressDto";
import { IPropertyDto } from "../../../../models/dto/interfaces/IPropertyDto";
import { IStateDto } from "../../../../models/dto/interfaces/IStateDto";
import { StaticDataProvider } from "../../../../services/static-data/static-data";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-property-profile-address",
  templateUrl: "./property-profile-address.page.html",
  styleUrls: ["./property-profile-address.page.scss"],
})
export class PropertyProfileAddressPage extends BasePage {
  public states: Array<IStateDto>;
  selected: boolean = true;
  streetAddress1: string = "";
  streetAddress2: string = "";
  city: string = "";
  state: any = 0;
  zip: string = "";
  public isIos: boolean = false;

  constructor(public navCtrl: NavController,
    private staticDataService: StaticDataProvider,
    private alert: UxNotifierService,
    public override router: Router,
    public override storageService: LocalStorageService,
    public override platform: Platform) {
    super(navCtrl, null, null, null, platform, null, null, null, null, null, storageService);
    console.log("ionViewDidLoad PropertyProfileAddressPage");

    //this.AppInsights.trackPageView({ name: 'ProfileAddressPage', properties: { userId: this.User.Id } });

    this.staticDataService.getStates().then(
      (x: Array<IStateDto>) => {
        this.states = x;
      },
      (err) => {}
    );

    this.isIos = this.platform.is('ios');
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileAddressPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileAddressPage' });
  }
  ionViewWillLoad() {}

  //go to bedroom page
  continue() {
    this.streetAddress1 = this.streetAddress1.trim();
    this.streetAddress2 = this.streetAddress2.trim();
    this.city = this.city.trim();
    this.zip = this.zip?.toString()?.trim() || "";

    if (this.streetAddress1 == "" || this.city == "" || this.state == "" || this.zip == "") {
      this.alert.presentSimpleAlert("All fields are required!", "");
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
      this.router.navigate(["property-profile-general-information"]);
    }
  }

  //go to home screen
  gotoHome() {
    //this.navCtrl.setRoot(SidemenuPage);
  }
}
