import { Component } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ModalController, NavController, NavParams, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { AssetIndexDto } from "src/app/models/dto/interfaces/AssetIndexDto";
import { IGoogleTextDetails } from "src/app/models/dto/interfaces/IGoogleTextDetails";
import { IProductDetails } from "src/app/models/dto/interfaces/IProductDetails";
import { ISearchEngineRequestDto } from "src/app/models/dto/interfaces/ISearchEngineRequestDto";
import { ISearchProductRequestDto } from "src/app/models/dto/interfaces/ISearchProductRequestDto";
import { SearchResultDto } from "src/app/models/dto/interfaces/ISearchResultDto";
import { ISearchYouTubeRequestDto } from "src/app/models/dto/interfaces/ISearchYouTubeRequestDto";
import { IYouTubeDto } from "src/app/models/dto/interfaces/IYouTubeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { SearchService } from "src/app/services/search/search.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-search-result-details",
  templateUrl: "./search-result-details.page.html",
  styleUrls: ["./search-result-details.page.scss"],
})
export class SearchResultDetailsPage extends BasePage {
  // Private
  private _loading: any = null;
  private _constants: Constants;

  // Public
  public source: string = "";
  public result: any = {};
  public videoUrl: SafeResourceUrl = null;

  constructor(
    public override navController: NavController,
    public override navParams: NavParams,
    public searchService: SearchService,
    private loadingController: LoadingController,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform,
    public override router: Router,
    private modalController: ModalController,
    public sanitizerService: DomSanitizer,
    public alertCtrl: AlertController
  ) {
    super(navController, navParams, null, null, null, router, uxNotifierService, null, null);
    this._constants = new Constants();
  }

  override ngOnInit() {
    console.log("ngOnInit SearchResultDetailsPage");
    //this.AppInsights.trackPageView({ name: 'SearchResultDetailsPage' });
    this.source = this.navParams.get("source");

    this.result = this.navParams.get("result");
    this.start();
  }

  private start() {
    switch (this.source) {
      case "Amazon":
      case "Google Shopping":
        this.result = this.result as ISearchProductRequestDto;
        break;
      case "Google Web":
        this.result = this.result as ISearchEngineRequestDto;
        break;
      case "YouTube":
        this.result = this.result as ISearchYouTubeRequestDto;
        this.videoUrl = this.sanitizerService.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.result.VideoID}`);
        break;
    }
  }

  private async getListAsync() {
    (
      await this.alertCtrl.create({
        message: "Which list does this go into?",
        buttons: [
          {
            text: "Wishlist",
            cssClass: "signout",
            handler: async () => {
              this.IsWishlist = true;
              await this.saveAsync();
            },
          },
          {
            text: "My Stuff",
            cssClass: "signout",
            handler: async () => {
              this.IsMy = true;
              await this.saveAsync();
            },
          },
        ],
      })
    ).present();
  }

  public async saveItem() {
    await this.getListAsync();
  }

  private async saveAsync() {
    this._loading = await this.loadingController.create({
      message: "saving...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();

    let searchResultDto: SearchResultDto = {} as SearchResultDto;
    searchResultDto.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
    searchResultDto.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
    searchResultDto.LineItemId = this.LineItem.Id;
    searchResultDto.LineItemLineItemTypeId = 0;
    searchResultDto.ProfileItemId = this.ProfileItem.Id === undefined ? 0 : this.ProfileItem.Id;
    searchResultDto.IsMy = this.IsMetattachment ? false : this.IsMy ?? false;
    searchResultDto.IsWishlist = this.IsMetattachment ? false : this.IsWishlist ?? false;
    searchResultDto.IsSuggest = this.IsMetattachment ? false : this.IsSuggest ?? false;
    searchResultDto.IsMetattach = this.IsMetattachment;
    searchResultDto.AssetInfoId = 0;

    let lastSavedItem: any;

    switch (this.source) {
      case "Amazon":
      case "Google Shopping":
        //this.ActiveItem.Image = this.result.Image;
        let productDetails: IProductDetails = {} as IProductDetails;
        productDetails.Image = this.result.Image;
        productDetails.Name = this.result.Name;
        productDetails.Description = this.result.Description;
        productDetails.Link = this.result.Link;
        productDetails.Price = this.result.Price;

        searchResultDto.ProductDetails = productDetails;
        lastSavedItem = searchResultDto;
        lastSavedItem.Type = this.source;
        localStorage.setItem("LastSavedItem", JSON.stringify(lastSavedItem));

        if (this.source === "Amazon") {
          await this.searchService.saveAmazonData(searchResultDto).then(
            (x: AssetIndexDto) => {
              localStorage.setItem("AssetIndex", JSON.stringify(x));
              this._loading.dismiss();
              this.uxNotifierService.showToast("Amazon product saved successfully!", this._constants.ToastColorGood);
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this.uxNotifierService.showToast("Error saving Amazon product!", this._constants.ToastColorBad);
              }
            }
          );
        }

        if (this.source === "Google Shopping") {
          await this.searchService.saveGoogleProductData(searchResultDto).then(
            (x: AssetIndexDto) => {
              localStorage.setItem("AssetIndex", JSON.stringify(x));
              this.uxNotifierService.showToast("Google product saved successfully!", this._constants.ToastColorGood);
              this._loading.dismiss();
            },
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
        googleDetails.Description = this.result.Description;
        googleDetails.Link = this.result.Link;
        googleDetails.Title = this.result.Title;
        searchResultDto.GoogleTextDetails = googleDetails;

        lastSavedItem = searchResultDto;
        lastSavedItem.Type = this.source;
        localStorage.setItem("LastSavedItem", JSON.stringify(lastSavedItem));

        await this.searchService.saveGoogleData(searchResultDto).then(
          (x: AssetIndexDto) => {
            localStorage.setItem("AssetIndex", JSON.stringify(x));
            this._loading.dismiss();
            this.uxNotifierService.showToast("Google results were saved successfully!", this._constants.ToastColorGood);
          },
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
        youTubeDetails.Title = this.result.Title;
        youTubeDetails.VideoID = this.result.VideoID;
        youTubeDetails.ThumbnailImg = this.result.ThumbnailImg;
        youTubeDetails.VideoUrl = this.result.VideoUrl;
        youTubeDetails.VideoDescription = this.result.VideoDescription;
        youTubeDetails.VideoDuration = this.result.VideoDuration;
        youTubeDetails.TotalViews = this.result.TotalViews;

        searchResultDto.YouTubeDetails = youTubeDetails;

        lastSavedItem = searchResultDto;
        lastSavedItem.Type = this.source;
        localStorage.setItem("LastSavedItem", JSON.stringify(lastSavedItem));

        this.videoUrl = this.sanitizerService.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.result.VideoID);

        await this.searchService.saveYouTubeData(searchResultDto).then(
          (x: AssetIndexDto) => {
            localStorage.setItem("AssetIndex", JSON.stringify(x));
            this._loading.dismiss();
            this.uxNotifierService.showToast("YouTube video saved successfully!", this._constants.ToastColorGood);
          },
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

    this.close();

    if (!this.IsMetattachment) {
      this.router.navigate(["items"]);
    } else {
      localStorage.setItem("ActiveItem", JSON.stringify(this.ActiveItem));
      this.router.navigate(["create-metattach"]);
    }
  }

  public close() {
    this.modalController.dismiss();
    this.IsMy = false;
    this.IsWishlist = false;
    this.IsSuggest = false;
  }
}
