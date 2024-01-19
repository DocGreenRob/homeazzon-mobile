import { Component, OnInit } from "@angular/core";
import { IListItem } from "src/app/models/dto/interfaces/IList";
import { BasePage } from "src/app/pages/base/base.page";
import { IProfileItemDto } from "src/app/models/dto/interfaces/IProfileItemDto";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { NavController, Platform, LoadingController } from "@ionic/angular";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { Router, NavigationExtras } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { Constants } from "../../../../common/Constants";

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
  private _constants: Constants;

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
    private loadingController: LoadingController,
    public override storageService: LocalStorageService
  ) {
    super(navController, null, null, null, platform, router, uxNotifierService, null, null, null, storageService);
    this._constants = new Constants();

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
    if(this.CurrentView !== 'Room'){
      this.profileItems.forEach((item: any)=>{
        this.selectedProfileItem = item;
        this.getLineitems();
      });
    }
    //this.AppInsights.trackPageView({ name: 'SearchPage' });
  }

  public goBack() {
    this.navController.back();
  }

  public close() {
    if (this._originalProfileItem !== this.ProfileItem) {
      if (this._originalProfileItem.Id === undefined) {
        this.storageService.delete("ProfileItem");
      } else {
        this.storageService.set("ProfileItem", this._originalProfileItem);
      }
    }
    if (this._originalLineItem !== this.LineItem) {
      if (this._originalLineItem.Id === undefined) {
        this.storageService.delete("LineItem");
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
      this.storageService.set("ProfileItem", profileItem);
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
      if(this.CurrentView == 'Room'){
        this._loading = await this.loadingController.create({
          message: "getting lineitems...",
          cssClass: "my-loading-class",
        });
        await this._loading.present();
      };

      // TODO: This should be the usertype from the selected property
      const userTypeShortName = this.getUserName(this.User.Types[0].Name);

        await this.propertyService
          .getProfileItems(this.selectedProfileItem.Id, userTypeShortName)
          .then(
            async (response: any) => {
              if (response && response != undefined) {
                
                if(this.CurrentView == 'Room'){
                  this.lineitems = [];
                }
                response.Area.LineItems.map((x) => {
                  this.lineitems.push({ Id: x.Id, Name: x.Name });
                });
              } else {
                this.uxNotifierService.presentSimpleAlert("Something went wrong. Please return and try this page again...", "Error");
              }

              this._loading?.dismiss();
            },
            (err) => {
              // debugger;
              if (err.status === 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              }
            }
          )
          .catch((error) => {
            console.log(error);
          });
    }
  }

  // sort
  public compareFn(i1: IListItem, i2: IListItem): boolean {
    return i1 && i2 ? i1.Id === i2.Id : i1 === i2;
  }

  private getUserName(userName: string) {
    if (userName.toLowerCase().indexOf('tradesman') > -1) {
      return this._constants.UserTypes.Tradesman;
    }
    if (userName.toLowerCase().indexOf('owner') > -1) {
      return this._constants.UserTypes.Owner;
    }
    if (userName.toLowerCase().indexOf('developer') > -1) {
      return this._constants.UserTypes.Developer;
    }
    if (userName.toLowerCase().indexOf('appraiser') > -1) {
      return this._constants.UserTypes.Appraiser;
    }
    if (userName.toLowerCase().indexOf('architect') > -1) {
      return this._constants.UserTypes.Architect;
    }
    if (userName.toLowerCase().indexOf('bank') > -1) {
      return this._constants.UserTypes.Bank;
    }
    if (userName.toLowerCase().indexOf('realtor') > -1) {
      return this._constants.UserTypes.Realtor;
    }
    if (userName.toLowerCase().indexOf('vendor') > -1) {
      return this._constants.UserTypes.Vendor;
    }
    throw new Error('User type not found');
  }
}
