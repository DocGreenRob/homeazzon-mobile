import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, NavController, Platform } from "@ionic/angular";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { BasePage } from "src/app/pages/base/base.page";
import { CommunicatorService } from "src/app/services/communicator/communicator.service";
import { FeaturesService } from "src/app/services/features/features.service";
import { Suite16CategoryService } from "src/app/services/suite16-category/suite16-category.service";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-line-items",
  templateUrl: "./line-items.page.html",
  styleUrls: ["./line-items.page.scss"],
})
export class LineItemsPage extends BasePage {
  // const

  // private

  // public
  public lineitems: Array<ILineitemDto> = new Array<ILineitemDto>();

  constructor(
    public navCtrl: NavController,
    public featureService: FeaturesService,
    public override platform: Platform,
    public override communicator: CommunicatorService,
    public override router: Router,
    private suite16CategoryService: Suite16CategoryService,
    public override uxNotifierService: UxNotifierService,
    public override menuController: MenuController,
    public override userTypesService: UserTypesService
  ) {
    super(navCtrl, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featureService);
  }

  override ngOnInit() {
    console.log("ngOnInit LineitemPage");
    //this.AppInsights.trackPageView({ name: 'LineitemPage' });
    console.log(this.ProfileItem);
    if (
      this.ProfileItem === undefined ||
      this.ProfileItem === null ||
      this.ProfileItem.AreaId === undefined ||
      this.ProfileItem.AreaId === null ||
      this.ProfileItem.AreaId === 0
    ) {
      this.suite16CategoryService.getLineitems(this.Suite16Category.Id).then(
        (x: Array<ILineitemDto>) => {
          this.lineitems = x;
          this.Lineitems = x;
        },
        (err) => {}
      );
    } else {
      this.suite16CategoryService.getAreaLineitems(this.ProfileItem.AreaId, this.Suite16Category.Id).then(
        (x: Array<ILineitemDto>) => {
          this.lineitems = x;
          this.Lineitems = x;
        },
        (err) => {}
      );
    }
  }

  public showItems(lineitem: ILineitemDto) {
    this.LineItem = lineitem;
    this.router.navigate(["items"]);
  }

  public close() {
    this.router.navigate(["dashboard"]);
  }
}
