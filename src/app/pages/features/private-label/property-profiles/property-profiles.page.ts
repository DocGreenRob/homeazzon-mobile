import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
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
  public privateLabelProperties: any;

  spinnerText: string;
  loadingVisible: boolean;
  
  public showBackButton: boolean = false;
  public isOwner: boolean = false;
  public isRealtor: boolean = false;
  public isPrivateLabelUser: boolean = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private loading: UtilitiesService,
    public override platform: Platform,
    public override router: Router,
    private privateLabelService: PrivateLabelService,
    private routerActive: ActivatedRoute,
    private storage: Storage,
    public override storageService: LocalStorageService
  ) {
    super(navCtrl, null, null, null, platform, router, null, null, null, null, storageService);
    this.getlabelprofile = this.getlabelprofile.bind(this);
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

    let _ = this.User;
    if (this.User?.Types) {
      this.User.Types.map((x) => {
        if (x.Name.toLowerCase().indexOf('owner') > -1) {
          this.isOwner = true;
        }
        if (x.Name.toLowerCase().indexOf('realtor') > -1) {
          this.isRealtor = true;
        }
      });
    }
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
    if (this.User?.IsPrivateLabelUser) {
      this.isPrivateLabelUser = true;

      this.presentSpinner('getting label profile...');
      //check whether user has a privateLabeler
      let privateLabelId = this.User.PrivateLabeler.Id;

      await this.privateLabelService.getPrivateLabelProperties(privateLabelId).then(
        (y: Array<IPropertyDto>) => {
          if (y) {
            //this.privateLabelProperties = y;

            this.dismissSpinner();

            this.setPrivateLabelProperties(y);
          }
        },
        (error) => {
          this.dismissSpinner();
          console.log(error);
        }
      );
    }
  }

  public setPrivateLabelProperties(x: any) {
    this.privateLabelProperties = x;
  }

  //navigate to BuildYourOwnGeneral page
  goToBuildYourGeneral() {
    this.storage.remove("SelectedPrivateLabelerProperty").then(
      (x) => {
        this.router.navigate(["property-profile-general-information"]);
      },
      (err) => { }
    );
  }

  public selectPrivateLabelPropertyProfile(privateLabelPropertyProfileId) {
    let a = this.privateLabelProperties.filter((x) => x.Id === privateLabelPropertyProfileId);
    this.SelectedPrivateLabelProperty = a[0];

    this.router.navigate(["property-profile-overview"]);
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
