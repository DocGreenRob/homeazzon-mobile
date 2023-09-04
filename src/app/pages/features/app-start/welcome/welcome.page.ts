import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, MenuController, NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Constants } from "src/app/common/Constants";
import { IAuthTokenDto } from "src/app/models/dto/interfaces/IAuthTokenDto";
import { IDeterminePathDto } from "src/app/models/dto/interfaces/IDeterminePathDto";
import { IFlagDto } from "src/app/models/dto/interfaces/IFlagDto";
import { BasePage } from "src/app/pages/base/base.page";
import { AccountService } from "src/app/services/account/account.service";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { UserDetailsService } from "src/app/services/user-details/user-details.service";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.page.html",
  styleUrls: ["./welcome.page.scss"],
})
export class WelcomePage extends BasePage {
  pendingPrivateLabelUserId: any;
  imageURL;
  public privateLabelName: string = "Evolved Dwellings";

  private constants: Constants;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private account: AccountService,
    public override router: Router,
    public alertCtrl: AlertController,
    private storage: Storage,
    private userService: UserDetailsService,
    private privatelabelService: PrivateLabelService,
    public override menuController: MenuController,
    public override platform: Platform
  ) {
    super(navCtrl, null, null, null, platform, router, null, null, null);
  }

  override ngOnInit() {
    //disable menu
    console.log("ngOnInit WelcomePage");
    //this.AppInsights.trackPageView({ name: 'WelcomePage' });

    this.menuController.enable(false, "propertyMenu");
    this.menuController.enable(false, "mainMenu");
    this.constants = new Constants();
    this.privatelabelLogo();
    this.getUserInformation();
  }

  async privatelabelLogo() {
    try {
      this.account.addprivatelabellogo(1).then(
        (response: any) => {
          if (response != null && response != 404) {
            this.imageURL = response.ImageUrl;
          } else {
            this.imageURL = "assets/imgs/defaultprivatelabel.png";
          }
        },
        (error) => {
          this.imageURL = "assets/imgs/defaultprivatelabel.png";
        }
      );
    } catch (error) {
      this.imageURL = "assets/imgs/defaultprivatelabel.png";
    }
  }

  gotologin() {
    this.router.navigate(["sign-in"]);
  }

  private async getUserInformation() {
    let determinePathObj: IDeterminePathDto;

    let authToken: IAuthTokenDto = JSON.parse(localStorage.getItem("AuthToken"));
    let expirationDate: any = new Date(authToken.Expires);

    if (expirationDate > new Date().getTime() / 1000) {
      // get user information
      this.account.getUser().then(
        async (authResponse: any) => {
          this.User = authResponse;

          if (determinePathObj === undefined || determinePathObj === null) {
            determinePathObj.IsPartnerShare = false;
            determinePathObj.IsPrivateLabelUserDownload = true;
            determinePathObj.PendingAppShareDownloadId = 0;
            determinePathObj.PendingPrivateLabelUserId = this.User.Id;
            determinePathObj.PrivateLabelId = this.User.PrivateLabeler.Id;

            await this.storage.set("determinePathObj", determinePathObj);
          }

          this.storage.set("FromLogin", true).then(
            (x) => {
              this.userService.getUserFlags(authResponse.Id / 1).then(
                (x: Array<IFlagDto>) => {
                  if (x && x.length > 0) {
                    var f = x.filter(
                      (x) =>
                        x.Name === this.constants.Flags.HasSelectedPrivateLabelerProperty || x.Name === this.constants.Flags.HasPrivateLabelUserCreatedProperty
                    );

                    if (f.length > 0) {
                      this.storage.set("HasPrivateLabelUserMadeSelection", true).then(
                        (x) => {
                          this.router.navigate(["dashboard"]);
                        },
                        (err) => {}
                      );
                    } else {
                      if (authResponse.IsPrivateLabelUser) {
                        this.getShowshareWithPartner();
                      } else {
                        this.router.navigate(["dashboard"]);
                      }
                    }
                  } else {
                    if (authResponse.IsPrivateLabelUser) {
                      this.getShowshareWithPartner();
                    } else {
                      this.router.navigate(["dashboard"]);
                    }
                  }
                },
                (err) => {}
              );
            },
            (err) => {}
          );
        },
        (err) => {
          console.log("error");
        }
      );
    } else {
      console.log("AuthToken Expired!");
    }
  }

  private async getShowshareWithPartner() {
    await this.privatelabelService.getShowSharewithPartner().then(
      (showShare: any) => {
        this.storage.get("determinePathObj").then(
          (x: IDeterminePathDto) => {
            if (showShare === true) {
              this.router.navigate(["share-mail-partner"]);
            } else {
              if (x.IsPrivateLabelUserDownload === true) {
                this.router.navigate(["property-profiles"]);
              } else {
                this.router.navigate(["dashboard"]);
              }
            }
          },
          (err) => {}
        );
      },
      (error) => {
        console.log("error", error);
        this.router.navigate(["share-with-partner"]);
      }
    );
  }
}
