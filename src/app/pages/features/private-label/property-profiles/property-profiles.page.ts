import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ModalController, NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";

@Component({
  selector: "app-property-profiles",
  templateUrl: "./property-profiles.page.html",
  styleUrls: ["./property-profiles.page.scss"],
})
export class PropertyProfilesPage extends BasePage {
  private privateLabelId: number;
  private profileId: any;
  private labelprofile: any;
  private userName: any;
  public privateLabelProperties: any = [];
  public showBackButton: boolean = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private loading: UtilitiesService,
    public override platform: Platform,
    public override router: Router,
    private privateLabelService: PrivateLabelService,
    private routerActive: ActivatedRoute,
    private storage: Storage
  ) {
    super(navCtrl, null, null, null, platform, router, null, null, null);
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfilesPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfilesPage' });

    this.routerActive.queryParams.subscribe((params) => {
      if (params["showBackButton"]) {
        this.showBackButton = true;
      }
    });

    console.log("ngOnInit PrivateLabelProfilePage");
    await this.getlabelprofile();

    // get the userName from the local-storage
    this.storage.get("userName").then((value) => {
      this.userName = value;
      console.log(this.userName, "this.userName value");
    });
  }

  // open Modal for get profile details
  showPropertyDetails(id: number, sqFeet: number, name: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        Id: id,
        SqFeet: sqFeet,
        propertyName: name,
      },
    };
    this.router.navigate(["property-profile-overview"], navigationExtras);
  }

  //get label profile  by PrivateLabelId
  async getlabelprofile() {
    if (!this.User?.IsPrivateLabelUser && !this.User?.IsPrivateLabelPartner) {
    } else {
      let loader = await this.loading.getLoader("getting label profile...");
      await loader.present();
      //check whether user has a privateLabeler
      let privateLabelId = this.User?.PrivateLabeler?.User?.Id ? this.User.PrivateLabeler.User.Id : this.User.Id;

      this.privateLabelService.getPrivateLabelProperties(privateLabelId).then(
        (y: Array<IPropertyDto>) => {
          if (y) {
            this.privateLabelProperties = y;
            loader.dismiss();
          }
        },
        (error) => {
          loader.dismiss();
          console.log(error);
        }
      );
    }
  }

  //navigate to BuildYourOwnGeneral page
  goToBuildYourGeneral() {
    this.storage.remove("SelectedPrivateLabelerProperty").then(
      (x) => {
        this.router.navigate(["property-profile-general-information"]);
      },
      (err) => {}
    );
  }

  public close() {
    this.navCtrl.pop();
  }
}
