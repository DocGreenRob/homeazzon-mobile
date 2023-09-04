import { Component, OnInit } from "@angular/core";
import { BasePage } from "src/app/pages/base/base.page";
import { NavController, LoadingController, ModalController, Platform } from "@ionic/angular";
import { SearchService } from "src/app/services/search/search.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ISearchRequestDto } from "src/app/models/dto/interfaces/ISearchRequestDto";
import { ISearchProductRequestDto } from "src/app/models/dto/interfaces/ISearchProductRequestDto";
import { ISearchEngineRequestDto } from "src/app/models/dto/interfaces/ISearchEngineRequestDto";
import { ISearchYouTubeRequestDto } from "src/app/models/dto/interfaces/ISearchYouTubeRequestDto";
import { SearchResultDetailsPage } from "../search-result-details/search-result-details.page";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.page.html",
  styleUrls: ["./search-results.page.scss"],
})
export class SearchResultsPage extends BasePage {
  _source: string = "";
  private _keyword: string = "";
  private _loading: any = null;
  showBackButton = true;
  public view: string = "";

  private currentProductPage: number = 1;

  constructor(
    public override navController: NavController,
    public searchService: SearchService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    public override uxNotifierService: UxNotifierService
  ) {
    super(navController, null, null, null, platform, router, uxNotifierService, null, null);
  }

  override ngOnInit() {
    console.log("ngOnInit SearchResultsPage");
    //this.AppInsights.trackPageView({ name: 'SearchResultsPage' });
    this.activeRoute.queryParams.subscribe((params) => {
      this._source = params["searchSource"];
      this._keyword = params["keyword"];
      this.start();
    });
  }

  public initiliazeView() {
    switch (this._source) {
      case "Amazon":
      case "Google Shopping":
        this.view = "SearchProductResult";
        break;
      case "Google Web":
        this.view = "SearchEngineResult";
        break;
      case "YouTube":
        this.view = "SearchYouTubeResult";
        break;
    }
  }

  public async start() {
    this._loading = await this.loadingController.create({
      message: "searching...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();

    let searchRequestDto: ISearchRequestDto = {
      AreaId: this.ProfileItem.Id === undefined ? 0 : this.ProfileItem.AreaId,
      LineItemId: this.LineItem.Id,
      Keyword: this._keyword,
    };

    let that: any = this;

    switch (this._source) {
      case "Amazon":
        this.searchService.searchAmazon(searchRequestDto.Keyword).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
      case "Google Shopping":
        this.searchService.searchGoogleProducts(searchRequestDto).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
      case "Google Web":
        this.searchService.searchGoogle(searchRequestDto).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
      case "YouTube":
        this.searchService.searchYouTube(searchRequestDto).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
    }
  }

  public searchProductResults: Array<ISearchProductRequestDto> = null;
  public searchEngineResults: Array<ISearchEngineRequestDto> = null;
  public searchYouTubeResults: Array<ISearchYouTubeRequestDto> = null;

  public searchResultHandlerSuccess(response: any, that: any) {
    this.initiliazeView();

    switch (this._source) {
      case "Amazon":
        this.searchProductResults = new Array<ISearchProductRequestDto>();
        const searchResults: any = response;

        searchResults.search_results.forEach((a) => {
          this.searchProductResults.push({
            Name: a.title,
            Description: a.title,
            Image: a.image,
            Link: a.link,
            Price: a.price?.value,
          });
        });
        debugger;
        break;
      case "Google Shopping":
        this.searchProductResults = response;
        break;
      case "Google Web":
        this.searchEngineResults = response;
        break;
      case "YouTube":
        this.searchYouTubeResults = response;
        break;
    }

    this._loading.dismiss();
  }

  public handleInfinite(infiniteScroll) {
    console.log("Begin async operation");
    let that: any = this;

    let searchRequestDto: ISearchRequestDto = {
      AreaId: this.ProfileItem.AreaId,
      LineItemId: this.LineItem.Id,
      Keyword: this._keyword,
    };

    const handleInfiniteSuccess = (response: any) => {
      this.currentProductPage++;
      this.view = "SearchProductResult";
      this.searchProductResults = [...this.searchProductResults, ...response];
      console.log("searchProductRequestDto", this.searchProductResults);
      console.log("Async operation has ended");
      infiniteScroll.complete();
    };

    setTimeout(() => {
      switch (this._source) {
        case "Amazon":
          this.searchService.searchAmazon(searchRequestDto.Keyword).then(handleInfiniteSuccess, this.searchResultHandlerError);
          break;
        case "Google Shopping":
          this.searchService.searchGoogleProducts(searchRequestDto).then(handleInfiniteSuccess, this.searchResultHandlerError);
          break;
      }
    }, 500);
  }

  public searchResultHandlerError = (err: any) => {
    this.initiliazeView();
    this._loading.dismiss();

    if (err.status == 401) {
      this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
      this.router.navigate(["sign-in"]);
    }
  };

  public async getSearchResultDetails(result: any) {
    let searchResultDetailsModal = await this.modalController.create({
      component: SearchResultDetailsPage,
      componentProps: { source: this._source, result: result },
      cssClass: "large-modal",
    });
    await searchResultDetailsModal.present();
  }

  public close() {
    this.navController.pop();
  }

  public goBack() {
    this.navController.back();
  }
}
