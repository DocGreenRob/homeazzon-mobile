import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { AlertController, LoadingController, ModalController, NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ILinkDto } from "src/app/models/dto/interfaces/ILinkDto";
import { BasePage } from "src/app/pages/base/base.page";
import { InteractiveModelModalPage } from "src/app/pages/modals/interactive-model-modal/interactive-model-modal.page";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";

@Component({
  selector: "app-property-profile-overview",
  templateUrl: "./property-profile-overview.page.html",
  styleUrls: ["./property-profile-overview.page.scss"],
})
export class PropertyProfileOverviewPage extends BasePage {
  public sqFeet: number;
  private propertyId: any;
  propertyName: string;
  private links: Array<ILinkDto>;
  spinnerText: string;
  loadingVisible: boolean;

  constructor(
    private navCtrl: NavController,
    private loading: UtilitiesService,
    private privatelabelService: PrivateLabelService,
    private modalCtrl: ModalController,
    private storage: Storage,
    private activeRoute: ActivatedRoute,
    public override router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public override storageService: LocalStorageService
  ) {
    super(null, null, null, null, null, router, null, null, null, null, storageService);
    this.links = new Array<ILinkDto>();
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileOverviewPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileOverviewPage' });

    let a = this.SelectedPrivateLabelProperty;
    this.sqFeet = a.SqFeet;
    this.propertyId = a.Id;
    this.propertyName = a.Name;
    this.propertyId = a.Id;
  }

  viewPropertyImages() {
    let navExtras: NavigationExtras = {
      queryParams: {
        Id: this.propertyId,
        Name: this.propertyName,
      },
    };
    this.router.navigate(["property-profile-images"], navExtras);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  chooseHome() {
    this.storage.set("SelectedPrivateLabelerProperty", this.propertyId).then(
      (x) => {
        let navExtras: NavigationExtras = {
          queryParams: {
            Id: this.propertyId,
            Name: this.propertyName,
          },
        };
        this.router.navigate(["choose-home"], navExtras);
      },
      (err) => { }
    );
  }

  viewPropertyOverview() {
    let navExtras: NavigationExtras = {
      queryParams: {
        Id: this.propertyId,
        Name: this.propertyName,
      },
    };
    this.router.navigate(["property-profile-details"], navExtras);
  }

  async showPlansInBrowser() {
    let linksModal = await this.modalCtrl.create({
      component: InteractiveModelModalPage,

      componentProps: { links: this.links },
    });
    await linksModal.present();
  }

  getLink(name: string) {
    return this.links.filter((y) => y.Name === name)[0].Url;
  }

  public async viewInteractiveModels() {
    this.presentSpinner("getting property plans...");

    await this.privatelabelService.getPrivateLabelProfilePlans(this.propertyId).then(
      (response: any) => {
        if (response) {
          console.log("property plans", response);
          this.links = response;

          this.dismissSpinner();
          this.showPlansInBrowser();
        }
      },
      (error) => {
        this.dismissSpinner();
        console.log(error);
      }
    );
  }

  public async close() {
    this.navCtrl.pop();
  }

  viewDesignPlans() {
    let navExtras: NavigationExtras = {
      queryParams: {
        Id: this.propertyId,
        Name: this.propertyName,
      },
    };
    this.router.navigate(["design-plans"], navExtras);
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
