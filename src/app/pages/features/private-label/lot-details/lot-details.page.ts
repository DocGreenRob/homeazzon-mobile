import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController, NavController, NavParams } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Constants } from "src/app/common/Constants";
import { ILotDto } from "src/app/models/dto/interfaces/ILotDto";
import { IPrivateLabelUserPropertyDto } from "src/app/models/dto/interfaces/IPrivateLabelUserPropertyDto";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { IUserDto } from "src/app/models/dto/interfaces/IUserDto";
import { IUserTypeDto } from "src/app/models/dto/interfaces/IUserTypeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { UserDetailsService } from "src/app/services/user-details/user-details.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-lot-details",
  templateUrl: "./lot-details.page.html",
  styleUrls: ["./lot-details.page.scss"],
})
export class LotDetailsPage extends BasePage {
  private lotId: number;
  browser: any;
  public lot: ILotDto = {} as ILotDto;
  public isPrivateLabelBuildYourOwn: boolean = false;
  private constants: any;
  developmentImage: string;
  totalPages: number = 0;
  zoom: number = 0;
  activePage = 1;

  constructor(
    public navCtrl: NavController,
    public override navParams: NavParams,
    public override uxNotifierService: UxNotifierService,
    private modalController: ModalController,
    private privateLabelService: PrivateLabelService,
    private storage: Storage,
    private loading: UtilitiesService,
    public override router: Router,
    private userService: UserDetailsService
  ) {
    super(navCtrl, navParams, null, null, null, router, uxNotifierService, null, null);
    this.lotId = this.navParams.get("Id");
    this.lot = {} as ILotDto;
    this.constants = new Constants();
  }

  override ngOnInit() {
    console.log("ngOnInit LotDetailsPage");
    //this.AppInsights.trackPageView({ name: 'LotDetailsPage' });

    this.isPrivateLabelBuildYourOwn = this.navParams.get("isPrivateLabelBuildYourOwn");
    this.developmentImage = this.navParams.get("imageUrl");
    this.privateLabelService.getLotDetails(this.lotId).then(
      (x: ILotDto) => {
        this.lot = x;
      },
      (err) => {}
    );
  }

  close() {
    this.modalController.dismiss();
  }

  viewLotPlan() {
    // use in-app-browser and show lot plan
    if (this.lot.LotPlanUrl && this.lot.LotPlanUrl != null) {
      this.browser = this.inAppBrowser.create(this.lot.LotPlanUrl, "_system");
      this.browser.executeScript();
    } else {
      this.uxNotifierService.showToast("The current lot doesn't have a plan", this.constants.ToastColorBad);
    }
  }

  afterLoadComplete($event: any) {
    this.totalPages = $event.numPages;
  }
  previousPage() {
    if (this.activePage == 1) {
    } else {
      this.activePage = this.activePage - 1;
    }
  }

  nextPage() {
    if (this.activePage == this.totalPages) {
    } else {
      this.activePage = this.activePage + 1;
    }
  }

  zoomReduce() {
    this.zoom = this.zoom - 1;
  }

  zoomIncrease() {
    this.zoom = this.zoom + 1;
  }

  async saveProperty() {
    let loader = await this.loading.getLoader("saving property ...");
    await loader.present();

    if (this.isPrivateLabelBuildYourOwn) {
      this.storage.get("CustomProperty").then(
        (x: IPropertyDto) => {
          x.Developments[0].Lots = new Array<ILotDto>();
          x.Developments[0].Lots.push(this.lot);
          x.User = {} as IUserDto;
          x.User.Email = this.User.Email;
          x.User.Id = this.User.Id;
          x.User.Types = new Array<IUserTypeDto>();

          let pluType = this.User.Types.filter((x) => x.Name === "PrivateLabelUser")[0];
          let userType = {} as IUserTypeDto;
          userType.Id = pluType.Id;
          userType.Name = pluType.Name;
          x.User.Types.push(userType);

          this.storage.set("CustomProperty", x);
          this.privateLabelService.saveCustomPropertyAsync(x).then(
            async (b) => {
              this.storage.get("HasPrivateLabelUserMadeSelection").then(
                async (x) => {
                  if (x && x === true) {
                    loader.dismiss();
                    this.modalController.dismiss();
                    this.router.navigate(["congratulations"]);
                  } else {
                    this.storage.set("HasSelectedPrivateLabelerProperty", true);
                    let o: IUserDto = {} as IUserDto;
                    o.Id = this.User.Id;
                    o.Email = this.User.Email;

                    await this.userService.setUserHasSelectedPrivateLabelerPropertyFlag(o).then(
                      (x) => {
                        loader.dismiss();
                        this.modalController.dismiss();
                        this.router.navigate(["congratulations"]);
                      },
                      (err) => {
                        loader.dismiss();
                      }
                    );
                  }
                },
                (err) => {}
              );
            },
            (err) => {
              loader.dismiss();
            }
          );
        },
        (err) => {
          loader.dismiss();
        }
      );
    } else {
      this.storage.get("SelectedPrivateLabelerProperty").then(
        async (x) => {
          if (x) {
            var o: IPrivateLabelUserPropertyDto = {} as IPrivateLabelUserPropertyDto;
            o.PropertyId = x;
            o.LotId = this.lotId;
            o.CurrentUser = this.User.Email;
            o.UserId = this.User.Id;
            await this.privateLabelService.saveSelectedProperty(o).then(
              async (x) => {
                this.storage.get("HasPrivateLabelUserMadeSelection").then(
                  async (x) => {
                    if (x && x === true) {
                      loader.dismiss();
                      this.modalController.dismiss();
                      this.router.navigate(["congratulations"]);
                    } else {
                      this.storage.set("HasPrivateLabelUserMadeSelection", true);
                      let u: IUserDto = {} as IUserDto;
                      u.Id = o.UserId;
                      u.Email = o.CurrentUser;

                      await this.userService.setUserHasSelectedPrivateLabelerPropertyFlag(u).then(
                        (x) => {
                          loader.dismiss();
                          this.modalController.dismiss();
                          this.router.navigate(["congratulations"]);
                        },
                        (err) => {}
                      );
                    }
                  },
                  (err) => {}
                );
              },
              (err) => {}
            );
          }
        },
        (err) => {}
      );
    }

    // go to "GoShopping"
  }
}
