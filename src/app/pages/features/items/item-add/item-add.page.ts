import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { AssetIndexDto } from "src/app/models/dto/interfaces/AssetIndexDto";
import { IActiveItem } from "src/app/models/dto/interfaces/IActiveItem";
import { IAssetInfoDto } from "src/app/models/dto/interfaces/IAssetInfoDto";
import { IBookmarkDto } from "src/app/models/dto/interfaces/IBookmarkDto";
import { IGoogleTextDetails } from "src/app/models/dto/interfaces/IGoogleTextDetails";
import { IProductDetails } from "src/app/models/dto/interfaces/IProductDetails";
import { SearchResultDto } from "src/app/models/dto/interfaces/ISearchResultDto";
import { IYouTubeDto } from "src/app/models/dto/interfaces/IYouTubeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { SearchService } from "src/app/services/search/search.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { ActiveItem } from "../../../../models/ActiveItem";

@Component({
  selector: "app-item-add",
  templateUrl: "./item-add.page.html",
  styleUrls: ["./item-add.page.scss"],
})
export class ItemAddPage extends BasePage {
  // private
  private commonAreas: Array<any> = new Array();
  private bedRoomAreas: Array<any> = new Array();
  private bathroomAreas: Array<any> = new Array();
  private _type: string = "";
  private _loading: any = null;
  private _constants: Constants;

  // public
  public pageTitle: string = "Add Item";
  public view: string = "SelectProfileItems";

  public activePropertyBedrooms: Array<any> = new Array();
  public activePropertyBathrooms: Array<any> = new Array();
  public activePropertyInteriorAreas: Array<any> = new Array();
  public activePropertyExteriorAreas: Array<any> = new Array();

  public selectedProfileItems: Array<any> = new Array();
  public image: string = "";
  public hasImage: boolean = true;
  public isBookmark: boolean = false;
  public showLineitems: boolean = false;
  public bookmarkUrl: string = "";

  constructor(
    public navCtrl: NavController,
    public override platform: Platform,
    public propertyProfilesService: PropertyProfilesService,
    private loadingController: LoadingController,
    public searchService: SearchService,
    public override uxNotifierService: UxNotifierService,
    public override router: Router
  ) {
    super(navCtrl, null, null, null, platform, null, null, null, null);

    this._constants = new Constants();
    this.image = this.QueryParams.Image;

    if (this.image == null) {
      this.hasImage = false;
    }
    this._type = this.QueryParams.type;
    this.bookmarkUrl = this.QueryParams.Url;

    if (this.bookmarkUrl != undefined && this.bookmarkUrl != null && this.bookmarkUrl != "") {
      this.isBookmark = true;
    }
  }

  override async ngOnInit() {
    console.log("ngOnInit ItemAddPage");
    //this.AppInsights.trackPageView({ name: 'ItemAddPage' });
    await this.getAreaTypes().then(
      () => {
        this.getPropertyProfiles();
      },
      (err) => {}
    );
  }

  public close() {
    this.navCtrl.pop();
  }

  public async next() {
    this._loading = await this.loadingController.create({
      message: "getting lineitems ...",
      cssClass: "my-loading-class",
    });
    this._loading.present();

    // 1. determine which options are selected
    this.selectedProfileItems = [];

    this.activePropertyBedrooms.forEach((x) => {
      if (x.IsChecked) {
        x.IsSaveToRoom = true;
        this.selectedProfileItems.push(x);
      }
    });

    this.activePropertyBathrooms.forEach((x) => {
      if (x.IsChecked) {
        x.IsSaveToRoom = true;
        this.selectedProfileItems.push(x);
      }
    });

    this.activePropertyInteriorAreas.forEach((x) => {
      if (x.IsChecked) {
        x.IsSaveToRoom = true;
        this.selectedProfileItems.push(x);
      }
    });

    this.activePropertyExteriorAreas.forEach((x) => {
      if (x.IsChecked) {
        x.IsSaveToRoom = true;
        this.selectedProfileItems.push(x);
      }
    });
    // 2. for each one selected, go get the lineitems
    // ../api/profileItem/{profileItemId}/PrivateLabelUser
    for (let i = 0; i < this.selectedProfileItems.length; i++) {
      this.getProfileItemLineItems(this.selectedProfileItems[i], this.User.Types[0].Name).then(
        () => {
          if (i == this.selectedProfileItems.length - 1) {
            this._loading.dismiss();
          }
        },
        (err) => {
          this._loading.dimiss();
        }
      );
    }
    //this.selectedProfileItems.forEach(async (x: any) => {
    //	await this.getProfileItemLineItems(x, this.User.Types[0].Name);
    //});
    this.view = "SelectLineItems";
  }

  public toggleCheck(event, obj, id) {
    //let isChecked: string = event.currentTarget.attributes[2].value;
    //let newValue: string = isChecked == 'true' ? 'false' : 'true';

    //obj.IsChecked = newValue == 'true' ? true : false;

    obj.IsChecked = !event.target.checked;
    //var a = this.activePropertyBedrooms;
  }

  public back() {
    this.view = "SelectProfileItems";
  }

  public save() {
    let selections: any = [];
    let isSaveToRoom: boolean = false;
    let source = this.QueryParams.source;
    let sourceParams = this.QueryParams.sourceParams;
    let isBreak: boolean = false;

    this.selectedProfileItems.forEach((a: any) => {
      isBreak = false;

      if (!a.IsSaveToRoom) {
        a.Lineitems.forEach((b: any) => {
          if (!isBreak) {
            if (b.IsChecked) {
              selections.push(a);
              isBreak = true;
            }
          }
        });
      } else {
        selections.push(a);
      }
    });

    localStorage.setItem("Selections", JSON.stringify(selections));

    if (this._type == "Bookmark") {
      let activeItem: ActiveItem = new ActiveItem();
      let bookmark: IBookmarkDto = {} as IBookmarkDto;

      bookmark.Url = this.bookmarkUrl;
      activeItem.Bookmark = bookmark;
      activeItem.AssetInfo = {} as IAssetInfoDto;

      this.ActiveItem = activeItem;
    }

    //this.navController.push('ItemEditPage',
    //	{
    //		'IsFromItemAddPage': true,
    //		'type': this._type,
    //		source: source,
    //		sourceParams: sourceParams
    //	});
    this.QueryParams = {
      IsFromItemAddPage: true,
      type: this._type,
      source: source,
      sourceParams: sourceParams,
    };
    this.router.navigate(["item-edit"]);
    //if (!isSaveToRoom) {

    //	if (this._type != 'Amazon' &&
    //		this._type != 'YouTube' &&
    //		this._type != 'Google Shopping' &&
    //		this._type != 'Google Web') {
    //		console.log('selections', selections);

    //		localStorage.setItem('Selections', JSON.stringify(selections));

    //		this.navController.push('ItemEditPage',
    //			{
    //				'IsFromItemAddPage': true,
    //				'type': this._type,
    //				source: source,
    //				sourceParams: sourceParams
    //			});
    //	} else {
    //		this._loading = this.loadingController.create({
    //			content: 'saving...',
    //			cssClass: 'my-loading-class'
    //		});
    //		this._loading.present();

    //		selections.forEach(async (x) => {
    //			await this.saveItem(x.ProfileItem.Id, x.Lineitem.Id);
    //		});

    //		this._loading.dismiss();
    //		this.uxNotifierService.showToast('Saved successfully!', this._constants.ToastColorGood);

    //		if (source == "DashboardPage") {
    //			this.navController.setRoot(DashboardPage);
    //		} else {
    //			this.navController.push(source, sourceParams);
    //		}

    //	}
    //}

    // if saving to a room && is bookmark
    // go to page to allow user to fill in info, then proceed
  }

  private getPropertyProfiles() {
    this.activePropertyBathrooms = [];
    this.activePropertyBedrooms = [];
    this.activePropertyExteriorAreas = [];
    this.activePropertyInteriorAreas = [];

    let that: any = this;
    this.ActiveProperty.Profiles.forEach((x) => {
      // Bedrooms
      let a: any = that.bedRoomAreas.filter((y) => y.Id == x.Area.Id)[0];

      if (a && a !== null) {
        x.ProfileItems.forEach((b) => {
          that.activePropertyBedrooms.push({
            Id: b.Id,
            Name: b.Name,
            SqFt: b.SqFt,
            Area: x.Area,
            IsChecked: false,
          });
        });
      }

      // Bathrooms
      a = that.bathroomAreas.filter((y) => y.Id == x.Area.Id)[0];
      if (a && a !== null) {
        x.ProfileItems.forEach((b) => {
          that.activePropertyBathrooms.push({
            Id: b.Id,
            Name: b.Name,
            SqFt: b.SqFt,
            Area: x.Area,
            IsChecked: false,
          });
        });
      }

      // Interior Areas
      a = that.commonAreas.filter((y) => y.Id == x.Area.Id)[0];
      if (a && a !== null) {
        x.ProfileItems.forEach((b) => {
          that.activePropertyInteriorAreas.push({
            Id: b.Id,
            Name: b.Name,
            SqFt: b.SqFt,
            Area: x.Area,
            IsChecked: false,
          });
        });
      }

      // Exterior Areas
      if (x.Area.Type.Name.toLowerCase() === "exterior") {
        x.ProfileItems.forEach((b) => {
          that.activePropertyExteriorAreas.push({
            Id: b.Id,
            Name: b.Name,
            SqFt: b.SqFt,
            Area: x.Area,
            IsChecked: false,
          });
        });
      }
    });
  }

  private async getAreaTypes() {
    await this.getInteriorAreas().then(
      () => {
        let bedRoomAreas = sessionStorage.getItem("bedroomAreas");
        let bathroomAreas = sessionStorage.getItem("bathroomAreas");
        let commonAreas = sessionStorage.getItem("commonAreas");

        if (!bedRoomAreas) {
          this.getBedrooms();
        } else {
          this.bedRoomAreas = JSON.parse(bedRoomAreas);
        }

        if (!bathroomAreas) {
          this.getBathroomAreas();
        } else {
          this.bathroomAreas = JSON.parse(bathroomAreas);
        }

        if (!commonAreas) {
          this.getInteriorAreas();
        } else {
          this.commonAreas = JSON.parse(commonAreas);
        }
      },
      (err) => {}
    );
  }

  private async getInteriorAreas() {
    await this.propertyProfilesService.getAreaTypes("interior").then((response: any) => {
      console.log(response);
      this.commonAreas = response;
      sessionStorage.setItem("commonAreas", JSON.stringify(this.commonAreas));
    });
  }

  private async getBedrooms() {
    this.propertyProfilesService.getAreaTypes("bedroom").then((response: Array<any>) => {
      this.bedRoomAreas = response;
      sessionStorage.setItem("bedroomAreas", JSON.stringify(this.bedRoomAreas));
    });
  }

  private async getBathroomAreas() {
    this.propertyProfilesService.getAreaTypes("bathroom").then((response: Array<any>) => {
      this.bathroomAreas = response;
      sessionStorage.setItem("bathroomAreas", JSON.stringify(this.bathroomAreas));
    });
  }

  // duplicated in profile-items
  private async getProfileItemLineItems(selectedProfileItem: any, userType: string) {
    //let a: Array<LineitemDto> = this.ProfileItemLineItems;
    // 12.19.19...rag...this will change to get => /api/profileItem/{profileItemId}/lineitems?userType={userTypeId}
    await this.propertyProfilesService
      .getProfileItems(selectedProfileItem.Id, userType)
      .then(
        async (response: any) => {
          selectedProfileItem.Lineitems = [];

          response.Area.LineItems.map((x) => {
            if (x.IsForDesign || x.IsForDigiDoc) {
              x.IsChecked = false;

              selectedProfileItem.Lineitems.push(x);
            }
          });
        },
        (err) => {
          if (err.status == 401) {
            this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
            this.router.navigate(["sign-in"]);
          }
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }

  // duplicated in search-result-details
  private async saveItem(profileItemId: number, lineitemId: number) {
    let searchResultDto: SearchResultDto = {} as SearchResultDto;
    searchResultDto.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
    searchResultDto.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
    searchResultDto.ProfileItemId = profileItemId;
    searchResultDto.LineItemId = lineitemId;
    searchResultDto.LineItemLineItemTypeId = 0;
    searchResultDto.IsMy = this.IsMetattachment ? false : this.IsMy ?? false;
    searchResultDto.IsWishlist = this.IsMetattachment ? false : this.IsWishlist ?? false;
    searchResultDto.IsSuggest = this.IsMetattachment ? false : this.IsSuggest ?? false;
    searchResultDto.IsMetattach = this.IsMetattachment;
    searchResultDto.AssetInfoId = 0;
    let lastSavedItem: any;

    switch (this._type) {
      case "Amazon":
      case "Google Shopping":
        //this.ActiveItem.Image = this.result.Image;
        let productDetails: IProductDetails = {} as IProductDetails;
        productDetails.Image = this.SelectedSearchResultDetail.Image;
        productDetails.Name = this.SelectedSearchResultDetail.Name;
        productDetails.Description = this.SelectedSearchResultDetail.Description;
        productDetails.Link = this.SelectedSearchResultDetail.Link;
        productDetails.Price = this.SelectedSearchResultDetail.Price;

        searchResultDto.ProductDetails = productDetails;
        lastSavedItem = searchResultDto;
        lastSavedItem.Type = this._type;
        localStorage.setItem("LastSavedItem", JSON.stringify(lastSavedItem));

        if (this._type === "Amazon") {
          await this.searchService.saveAmazonData(searchResultDto).then(
            (x: AssetIndexDto) => {},
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                //this.navController.setRoot(SignInPage);
                this.router.navigate(["sign-in"]);
              } else {
                this.uxNotifierService.showToast("Error saving Amazon product!", this._constants.ToastColorBad);
              }
            }
          );
        }

        if (this._type === "Google Shopping") {
          await this.searchService.saveGoogleProductData(searchResultDto).then(
            (x: AssetIndexDto) => {},
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this.uxNotifierService.showToast("Error saving Google product!", this._constants.ToastColorBad);
              }
            }
          );
        }
        break;
      case "Google Web":
        let googleDetails: IGoogleTextDetails = {} as IGoogleTextDetails;
        googleDetails.Description = this.SelectedSearchResultDetail.Description;
        googleDetails.Link = this.SelectedSearchResultDetail.Link;
        googleDetails.Title = this.SelectedSearchResultDetail.Title;
        searchResultDto.GoogleTextDetails = googleDetails;

        lastSavedItem = searchResultDto;
        lastSavedItem.Type = this._type;
        localStorage.setItem("LastSavedItem", JSON.stringify(lastSavedItem));

        await this.searchService.saveGoogleData(searchResultDto).then(
          (x: AssetIndexDto) => {},
          (err) => {
            this._loading.dismiss();
            if (err.status == 401) {
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            } else {
              this.uxNotifierService.showToast("Google results were not saved!", this._constants.ToastColorBad);
            }
          }
        );
        break;
      case "YouTube":
        let youTubeDetails: IYouTubeDto = {} as IYouTubeDto;
        youTubeDetails.Title = this.SelectedSearchResultDetail.Title;
        youTubeDetails.VideoID = this.SelectedSearchResultDetail.VideoID;
        youTubeDetails.ThumbnailImg = this.SelectedSearchResultDetail.ThumbnailImg;
        youTubeDetails.VideoUrl = this.SelectedSearchResultDetail.VideoUrl;
        youTubeDetails.VideoDescription = this.SelectedSearchResultDetail.VideoDescription;
        youTubeDetails.VideoDuration = this.SelectedSearchResultDetail.VideoDuration;
        youTubeDetails.TotalViews = this.SelectedSearchResultDetail.TotalViews;

        searchResultDto.YouTubeDetails = youTubeDetails;

        lastSavedItem = searchResultDto;
        lastSavedItem.Type = this._type;
        localStorage.setItem("LastSavedItem", JSON.stringify(lastSavedItem));

        await this.searchService.saveYouTubeData(searchResultDto).then(
          (x: AssetIndexDto) => {},
          (err) => {
            this._loading.dismiss();
            if (err.status == 401) {
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            } else {
              this.uxNotifierService.showToast("Error saving YouTube video!", this._constants.ToastColorBad);
            }
          }
        );
        break;
    }

    this.IsMy = false;
    this.IsWishlist = false;
    this.IsSuggest = false;
  }
}
