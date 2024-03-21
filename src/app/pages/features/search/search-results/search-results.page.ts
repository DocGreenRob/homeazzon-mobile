import { Component, OnInit } from "@angular/core";
import { BasePage } from "src/app/pages/base/base.page";
import { NavController, LoadingController, ModalController, Platform, InfiniteScrollCustomEvent } from "@ionic/angular";
import { SearchService } from "src/app/services/search/search.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ISearchRequestDto } from "src/app/models/dto/interfaces/ISearchRequestDto";
import { ISearchProductRequestDto } from "src/app/models/dto/interfaces/ISearchProductRequestDto";
import { ISearchEngineRequestDto } from "src/app/models/dto/interfaces/ISearchEngineRequestDto";
import { ISearchYouTubeRequestDto } from "src/app/models/dto/interfaces/ISearchYouTubeRequestDto";
import { SearchResultDetailsPage } from "../search-result-details/search-result-details.page";
import { LocalStorageService } from "@app/services/local-storage.service";

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
  public isIos: boolean = false;
  spinnerText: string = 'Loading...';
  loading1Visible: boolean = false;
  private startpage = 1;
  private endpage = 30

  private currentProductPage: number = 1;

  constructor(
    public override navController: NavController,
    public searchService: SearchService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    public override uxNotifierService: UxNotifierService,
    public override storageService: LocalStorageService
  ) {
    super(navController, null, null, null, platform, router, uxNotifierService, null, null, null, storageService);
    this.isIos = this.platform.is('ios');
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


    this.presentSpinner('searching...');

    let searchRequestDto: ISearchRequestDto = {
      AreaId: this.ProfileItem.Id === undefined ? 0 : this.ProfileItem.AreaId,
      LineItemId: this.LineItem.Id,
      Keyword: this._keyword,
    };

    let that: any = this;

    switch (this._source) {
      case "Amazon":
        this.searchService.searchAmazonProduct(searchRequestDto.Keyword,this.currentProductPage).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
      case "Google Shopping":
        this.searchService.searchGoogleProducts(searchRequestDto.Keyword,1,30).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
      case "Google Web":
        this.searchService.searchGoogle(searchRequestDto).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
        break;
      case "YouTube":
        this.searchService.searchYouTube(searchRequestDto.Keyword).then((x) => this.searchResultHandlerSuccess(x, that), this.searchResultHandlerError);
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
            Name: a.product_title,
            Description: a.product_title,
            Image: a.product_photo,
            Link: a.product_url,
            Price: a.product_price,
          });
        });
        // debugger;
        break;
      case "Google Shopping":
        // this.searchProductResults = response;
        this.searchProductResults = new Array<ISearchProductRequestDto>();
        response.shopping_results.forEach((a) => {
          this.searchProductResults.push({
            Name: a.title,
            Description: a.title,
            Image: a.thumbnail,
            Link: a.link,
            Price: a.price,
          });
        });
        break;
      case "Google Web":
        this.searchEngineResults = response;
        break;
      case "YouTube":
        // this.searchYouTubeResults = response;
        this.searchYouTubeResults = new Array<ISearchYouTubeRequestDto>();
        const Result: any = response;
        Result.video_results.forEach((a) => {
          this.searchYouTubeResults.push({
            Title: a.title,
            VideoDescription: a.description,
            ThumbnailImg: a.thumbnail.static,
            VideoUrl: a.link,
          });
        });
        break;
    }

    this.dismissSpinner();

  }

  generateinfinitedata() {
    console.log("Begin async operation");
    let searchRequestDto: ISearchRequestDto = {
      AreaId: this.ProfileItem.AreaId,
      LineItemId: this.LineItem.Id,
      Keyword: this._keyword,
    };
    switch (this._source) {
      case "Amazon":
        this.currentProductPage++;
        this.searchService.searchAmazonProduct(searchRequestDto.Keyword, this.currentProductPage)
          .then((response: any) => {
            this.view = "SearchProductResult";
            response.data.products.forEach((a) => {
              this.searchProductResults.push({
                Name: a.product_title,
                Description: a.product_title,
                Image: a.product_photo,
                Link: a.product_url,
                Price: a.product_price,
              });
            }),
            this.searchResultHandlerError
          })
        break;
      case "Google Shopping":
        this.searchService.searchGoogleProducts(searchRequestDto.Keyword,1,30)
        .then((response: any) => {
          this.currentProductPage++;
          this.view = "SearchProductResult";
          this.searchProductResults = [...this.searchProductResults, ...response];
          console.log("searchProductRequestDto", this.searchProductResults);
          console.log("Async operation has ended");
        }, this.searchResultHandlerError);
        break;
    }
  }

  onIonInfinite(infiniteScroll) {
    let searchRequestDto: ISearchRequestDto = {
      AreaId: this.ProfileItem.Id === undefined ? 0 : this.ProfileItem.AreaId,
      LineItemId: this.LineItem.Id,
      Keyword: this._keyword,
    };
    this.generateinfinitedata();

     const handleInfiniteSuccess = (response: any) => {
      this.currentProductPage++;
      this.view = "SearchProductResult";
      this.searchProductResults = [...this.searchProductResults, ...response];
      console.log("searchProductRequestDto", this.searchProductResults);
      console.log("Async operation has ended");
      infiniteScroll.complete();
    };

    setTimeout(() => {
      this.startpage+=30
      this.endpage+=this.startpage
      switch (this._source) {
        case "Amazon":
          this.searchService.searchAmazon(searchRequestDto.Keyword).then(handleInfiniteSuccess, this.searchResultHandlerError);
          break;
        case "Google Shopping":
          this.searchService.searchGoogleProducts(searchRequestDto.Keyword ,this.startpage, this.endpage)
          .then((response: any) => {
            this.view = "SearchProductResult";
            response.shopping_results.forEach((a) => {
              this.searchProductResults.push({
                Name: a.title,
                Description: a.title,
                Image: a.thumbnail,
                Link: a.link,
                Price: a.price,
              });
            });
            this.searchResultHandlerError
          })
        break;
      }
      (infiniteScroll as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  public searchResultHandlerError = (err: any) => {
    this.initiliazeView();
    this.dismissSpinner();


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
  async presentSpinner(text: string) {
    this.spinnerText = text;
    this.loading1Visible = true;
  }

  async dismissSpinner() {
    this.loading1Visible = false;
    this.spinnerText = '';
  }

}