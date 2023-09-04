import { Component, OnInit } from "@angular/core";
import { IListItem } from "src/app/models/dto/interfaces/IList";
import { BasePage } from "src/app/pages/base/base.page";
import { IProfileItemDto } from "src/app/models/dto/interfaces/IProfileItemDto";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { NavController, Platform, LoadingController } from "@ionic/angular";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage extends BasePage {
  // Private
  private _loading: any = null;
  private _originalProfileItem: IProfileItemDto = this.ProfileItem;
  private _originalLineItem: ILineitemDto = this.LineItem;

  // Public
  public profileItems: Array<IListItem> = [];
  public lineitems: Array<IListItem> = [];
  public searchSources: Array<string> = ["Amazon", "Google Web", "Google Shopping", "YouTube"];
  public keywords: string = "";
  public selectedProfileItem: any = this.ProfileItem;
  public selectedLineitem: any = this.LineItem;
  public searchSource: string = "";
  public disableProfileItems: boolean = false;
  public disableLineItems: boolean = false;

  constructor(
    public override navController: NavController,
    public override uxNotifierService: UxNotifierService,
    private propertyService: PropertyProfilesService,
    public override platform: Platform,
    public override router: Router,
    private loadingController: LoadingController
  ) {
    super(navController, null, null, null, platform, router, uxNotifierService, null, null);

    if (this.selectedProfileItem.Id !== undefined) {
      this.selectedProfileItem = {
        Id: this.ProfileItem.Id,
        Name: this.ProfileItem.Name,
      };
    }

    this.selectedProfileItem = null;
    this.selectedProfileItem = this.ProfileItem;

    this.selectedLineitem = null;
    this.selectedLineitem = this.LineItem;

    this.ActiveProperty.Profiles.map((x) => {
      x.ProfileItems.map((y) => {
        this.profileItems.push({
          Id: y.Id,
          Name: y.Name,
        });
      });
    });

    this.lineitems = [];

    this.Lineitems.map((x) => {
      this.lineitems.push({
        Id: x.Id,
        Name: x.Name,
      });
    });

    if (this.IsMetattachment) {
      this.disableProfileItems = true;
      this.disableLineItems = true;
    }
  }
  override async ngOnInit() {
    console.log("ngOnInit SearchPage");
    //this.AppInsights.trackPageView({ name: 'SearchPage' });
  }

  public goBack() {
    this.navController.back();
  }

  public close() {
    if (this._originalProfileItem !== this.ProfileItem) {
      if (this._originalProfileItem.Id === undefined) {
        localStorage.removeItem("ProfileItem");
      } else {
        localStorage.setItem("ProfileItem", JSON.stringify(this._originalProfileItem));
      }
    }
    if (this._originalLineItem !== this.LineItem) {
      if (this._originalLineItem.Id === undefined) {
        localStorage.removeItem("LineItem");
      } else {
        this.LineItem = this._originalLineItem;
      }
    }

    this.navController.pop();
  }

  public override search() {
    if (this.CurrentView === "Room") {
      if (this.ProfileItem.Id === undefined && this.selectedProfileItem.Id === undefined) {
        this.uxNotifierService.presentSimpleAlert("Please select a room type!", "Error");
        return;
      }
    }

    if (this.LineItem?.Id === undefined && this.selectedLineitem?.Id === undefined) {
      this.uxNotifierService.presentSimpleAlert("Please select a category!", "Error");
      return;
    }

    if (this.CurrentView === "Room") {
      let profileItem: IProfileItemDto = { Id: this.selectedProfileItem.Id, Name: this.selectedProfileItem.Name };
      localStorage.setItem("ProfileItem", JSON.stringify(profileItem));
    }

    let lineitem: ILineitemDto = { Id: this.selectedLineitem.Id, Name: this.selectedLineitem.Name };
    this.LineItem = lineitem;

    if (this.searchSource === "") {
      this.uxNotifierService.presentSimpleAlert("Please select a search source!", "Error");
      return;
    }
    let keywords: string = this.keywords;
    let navExtras: NavigationExtras = {
      queryParams: {
        searchSource: this.searchSource,
        keyword: keywords,
      },
    };
    this.router.navigate(["search-results"], navExtras);
  }

  public async getLineitems() {
    if (this.selectedProfileItem) {
      this._loading = await this.loadingController.create({
        message: "getting lineitems...",
        cssClass: "my-loading-class",
      });
      await this._loading.present();

      await this.propertyService
        .getProfileItems(this.selectedProfileItem.Id, this.User.Types[0].Name)
        .then(
          async (response: any) => {
            if (response && response != undefined) {
              response.Area.LineItems.map((x) => {
                this.lineitems.push({ Id: x.Id, Name: x.Name });
              });
            } else {
              this.uxNotifierService.presentSimpleAlert("Something went wrong. Please return and try this page again...", "Error");
            }

            this._loading.dismiss();
          },
          (err) => {
            debugger;
            if (err.status === 401) {
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        )
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  }

  // sort
  compareFn(i1: IListItem, i2: IListItem): boolean {
    return i1 && i2 ? i1.Id === i2.Id : i1 === i2;
  }
}
