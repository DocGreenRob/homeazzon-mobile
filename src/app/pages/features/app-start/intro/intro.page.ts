import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { IDeterminePathDto } from "src/app/models/dto/interfaces/IDeterminePathDto";
import { IPrivateLabelerDto_Get } from "src/app/models/dto/interfaces/IPrivateLabelerDto_Get";
import { IUserDto } from "src/app/models/dto/interfaces/IUserDto";
import { BasePage } from "src/app/pages/base/base.page";

@Component({
  selector: "app-intro",
  templateUrl: "./intro.page.html",
  styleUrls: ["./intro.page.scss"],
})
export class IntroPage extends BasePage {
  public user: IUserDto;
  public privateLabeler: IPrivateLabelerDto_Get;

  constructor(public navCtrl: NavController, public override platform: Platform, public override router: Router, private storage: Storage) {
    super(navCtrl, null, null, null, platform, router, null, null, null);

    this.user = {} as IUserDto;
    this.user.FirstName = "Chuck";
    this.user.LastName = "Norris";

    this.privateLabeler = {} as IPrivateLabelerDto_Get;
    this.privateLabeler.Name = `Innovative Technological Thinking`;
  }

  override ionViewDidLoad() {
    console.log("ionViewDidLoad IntroPage");
  }

  override ngOnInit() {
    console.log("ngOnInit IntroPage");
    //this.AppInsights.trackPageView({ name: 'IntroPage' });
  }

  continue() {
    this.storage.get("determinePathObj").then(
      (x: IDeterminePathDto) => {
        if (x && x.IsPrivateLabelUserDownload === true) {
          this.storage.get("HasSelectedPrivateLabelerProperty").then(
            (x) => {
              if (x === true) {
                this.router.navigate(["dashboard"]);
              } else {
                this.router.navigate(["property-profiles"]);
              }
            },
            (err) => {}
          );
        } else {
          this.router.navigate(["dashboard"]);
        }
      },
      (err) => {}
    );
  }
}
