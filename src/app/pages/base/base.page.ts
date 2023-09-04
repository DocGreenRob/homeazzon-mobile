import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, NavController, NavParams, Platform } from "@ionic/angular";
import { ApplicationInsights, DistributedTracingModes } from "@microsoft/applicationinsights-web";
import { ActiveItem } from "src/app/models/ActiveItem";
import { AssetInfoDto } from "src/app/models/dto/AssetInfoDto";
import { AssetIndexDto } from "src/app/models/dto/interfaces/AssetIndexDto";
import { IActiveItem } from "src/app/models/dto/interfaces/IActiveItem";
import { IAssetInfoDto } from "src/app/models/dto/interfaces/IAssetInfoDto";
import { ICompanyTypesLookupDto } from "src/app/models/dto/interfaces/ICompanyTypesLookupDto";
import { IFeatureDto } from "src/app/models/dto/interfaces/IFeatureDto";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { IMetattachmentDto } from "src/app/models/dto/interfaces/IMetattachmentDto";
import { INewPropertyDto } from "src/app/models/dto/interfaces/INewPropertyDto";
import { IProfileItemDto } from "src/app/models/dto/interfaces/IProfileItemDto";
import { ISearchResultDetailDto } from "src/app/models/dto/interfaces/ISearchResultDetailDto";
import { ISuite16CategoryDto } from "src/app/models/dto/interfaces/ISuite16Category";
import { ISuite16CategoryLineitemDto } from "src/app/models/dto/interfaces/ISuite16CategoryLineitemDto";
import { IUserDto } from "src/app/models/dto/interfaces/IUserDto";
import { CommunicatorService } from "src/app/services/communicator/communicator.service";
import { FeaturesService } from "src/app/services/features/features.service";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { environment } from "../../../environments/environment";
import { IAddressDto } from "../../models/dto/interfaces/IAddressDto";
import { IAuthTokenDto } from "../../models/dto/interfaces/IAuthTokenDto";
import { IBookmarkDto } from "../../models/dto/interfaces/IBookmarkDto";
import { ICompanyInformationDto } from "../../models/dto/interfaces/ICompanyInformationDto";
import { IdTokenDto } from "../../models/dto/interfaces/IdTokenDto";
import { IPropertyDto } from "../../models/dto/interfaces/IPropertyDto";
import { IUserTypeDto } from "../../models/dto/interfaces/IUserTypeDto";
import { ProfileItemImageDto } from "../../models/dto/ProfileItemImageDto";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";

@Component({
  selector: "app-base",
  templateUrl: "./base.page.html",
  styleUrls: ["./base.page.scss"],
})
export class BasePage implements OnInit {
  ngOnInit() {}

  private applicationInsights: ApplicationInsights = null;

  get AppInsights(): ApplicationInsights {
    // https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript
    if (this.applicationInsights === null) {
      this.applicationInsights = new ApplicationInsights({
        config: {
          instrumentationKey: environment.azureInstrumentaionKey,
          distributedTracingMode: DistributedTracingModes.W3C,
          enableAutoRouteTracking: true,

          autoExceptionInstrumented: true,
          appId: "HomeaZZon",
          autoTrackPageVisitTime: true,
          autoUnhandledPromiseInstrumented: true,
          disableAjaxTracking: false,
          disableCorrelationHeaders: false,
          disableDataLossAnalysis: false,
          disableExceptionTracking: false,
          disableFetchTracking: false,
          disableFlushOnBeforeUnload: false,
          disableFlushOnUnload: false,
          disableTelemetry: false,
          emitLineDelimitedJson: true,
          enableAjaxErrorStatusText: true,
          enableAjaxPerfTracking: true,
          //enableCorsCorrelation: true, // causes errors
          enableDebug: true,
          // enableDebugExceptions: true,
          enableRequestHeaderTracking: true,
          enableResponseHeaderTracking: true,
          enableSessionStorageBuffer: true,
          enableUnhandledPromiseRejectionTracking: true,
          loggingLevelConsole: 2,
          loggingLevelTelemetry: 2,
          isBrowserLinkTrackingEnabled: true,
        },
      });

      this.applicationInsights.loadAppInsights();
    }

    return this.applicationInsights;
  }

  // AuthToken
  get AuthToken(): IAuthTokenDto {
    let a: IAuthTokenDto = JSON.parse(localStorage.getItem("AuthToken"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set AuthToken(value: IAuthTokenDto) {
    localStorage.setItem("AuthToken", JSON.stringify(value));
  }

  // IdToken
  get IdToken(): IdTokenDto {
    let a: IdTokenDto = JSON.parse(localStorage.getItem("IdToken"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set IdToken(value: IdTokenDto) {
    localStorage.setItem("IdToken", JSON.stringify(value));
  }

  // User
  get User(): IUserDto {
    let a: IUserDto = JSON.parse(localStorage.getItem("User"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set User(value: IUserDto) {
    localStorage.setItem("User", JSON.stringify(value));
  }

  // UserTypes
  get UserTypes(): Array<IUserTypeDto> {
    let a: Array<IUserTypeDto> = JSON.parse(localStorage.getItem("UserTypes"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set UserTypes(value: Array<IUserTypeDto>) {
    localStorage.setItem("UserTypes", JSON.stringify(value));
  }

  // CompanyTypes
  get CompanyTypes(): ICompanyTypesLookupDto {
    let a: ICompanyTypesLookupDto = JSON.parse(localStorage.getItem("CompanyTypes"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set CompanyTypes(value: ICompanyTypesLookupDto) {
    localStorage.setItem("CompanyTypes", JSON.stringify(value));
  }

  // ActiveProperty
  get ActiveProperty(): INewPropertyDto {
    let a: INewPropertyDto = {
      City: "",
      Customer: {
        Email: "",
        Id: 0,
        Name: "",
      },
      Id: 0,
      IsDefault: false,
      IsProxy: false,
      Name: "",
      Profiles: [],
      SqFt: 0,
      State: "",
      StreetAddress1: "",
      TotalStories: 0,
      UserTypeId: 0,
    };

    a = JSON.parse(localStorage.getItem("ActiveProperty"));

    if (a == undefined || a == null) {
      return a;
    }
    return a;
  }
  set ActiveProperty(value: INewPropertyDto) {
    if (value != undefined) {
      localStorage.setItem("ActiveProperty", JSON.stringify(value));
    }
  }

  // CustomProperty
  get CustomProperty(): IPropertyDto {
    let a: IPropertyDto = {} as IPropertyDto;

    a = JSON.parse(localStorage.getItem("CustomProperty"));

    if (a == undefined || a == null) {
      return a;
    }
    return a;
  }
  set CustomProperty(value: IPropertyDto) {
    if (value != undefined) {
      localStorage.setItem("CustomProperty", JSON.stringify(value));
    }
  }

  // Properties
  get Properties(): Array<INewPropertyDto> {
    let a: Array<INewPropertyDto> = JSON.parse(localStorage.getItem("Properties"));
    if (a == undefined || a == null) {
      return new Array<INewPropertyDto>();
    }
    return a;
  }
  set Properties(value: Array<INewPropertyDto>) {
    localStorage.setItem("Properties", JSON.stringify(value));
  }

  // ProfileItem
  get ProfileItem(): IProfileItemDto {
    let a: IProfileItemDto = JSON.parse(localStorage.getItem("ProfileItem"));
    if (a == undefined || a == null) {
      return { Id: 0, AreaId: 0, Name: "" };
    }
    return a;
  }
  set ProfileItem(value: IProfileItemDto) {
    localStorage.setItem("ProfileItem", JSON.stringify(value));
  }

  // Lineitem
  get LineItem(): ILineitemDto {
    let a: ILineitemDto = JSON.parse(localStorage.getItem("LineItem"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set LineItem(value: ILineitemDto) {
    localStorage.setItem("LineItem", JSON.stringify(value));
  }

  // ProfileItemLineItems
  get ProfileItemLineItems(): Array<ILineitemDto> {
    let a: Array<ILineitemDto> = JSON.parse(localStorage.getItem("ProfileItemLineItems"));
    if (a == undefined || a == null) {
      return new Array<ILineitemDto>();
    }
    return a;
  }
  set ProfileItemLineItems(value: Array<ILineitemDto>) {
    localStorage.setItem("ProfileItemLineItems", JSON.stringify(value));
  }

  // ActiveItem
  get ActiveItem(): ActiveItem {
    let a: ActiveItem = JSON.parse(localStorage.getItem("ActiveItem"));
    if (a == undefined || a == null) {
      let activeItem: ActiveItem = new ActiveItem();
      activeItem.AssetInfo = new AssetInfoDto();
      return activeItem;
    }
    return a;
  }
  set ActiveItem(value: ActiveItem) {
    localStorage.setItem("ActiveItem", JSON.stringify(value));
  }

  // ActiveAttachmentItem
  get ActiveAttachmentItem(): ActiveItem {
    let a: ActiveItem = JSON.parse(localStorage.getItem("ActiveAttachmentItem"));
    if (a == undefined || a == null) {
      let activeItem: ActiveItem = new ActiveItem();
      activeItem.AssetInfo = new AssetInfoDto();
      return activeItem;
    }
    return a;
  }
  set ActiveAttachmentItem(value: ActiveItem) {
    localStorage.setItem("ActiveAttachmentItem", JSON.stringify(value));
  }

  // Metattachments
  get Metattachments(): Array<Array<IMetattachmentDto>> {
    let a: Array<Array<IMetattachmentDto>> = JSON.parse(localStorage.getItem("Metattachments"));
    if (a == undefined || a == null) {
      return new Array<Array<IMetattachmentDto>>();
    }
    return a;
  }
  set Metattachments(value: Array<Array<IMetattachmentDto>>) {
    localStorage.setItem("Metattachments", JSON.stringify(value));
  }

  // IsMetattachment
  get IsMetattachment(): boolean {
    let a: boolean = JSON.parse(localStorage.getItem("IsMetattachment"));
    if (a == undefined || a == null) {
      return false;
    }
    return a;
  }
  set IsMetattachment(value: boolean) {
    localStorage.setItem("IsMetattachment", JSON.stringify(value));
  }

  // ActiveAttachment
  get ActiveAttachment(): IMetattachmentDto {
    let a: IMetattachmentDto = JSON.parse(localStorage.getItem("ActiveAttachment"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set ActiveAttachment(value: IMetattachmentDto) {
    localStorage.setItem("ActiveAttachment", JSON.stringify(value));
  }

  // AssetIndex
  get AssetIndex(): AssetIndexDto {
    let a: AssetIndexDto = JSON.parse(localStorage.getItem("AssetIndex"));
    if (a == undefined || a == null) {
      let activeItem: AssetIndexDto = null;
      return activeItem;
    }
    return a;
  }
  set AssetIndex(value: AssetIndexDto) {
    localStorage.setItem("AssetIndex", JSON.stringify(value));
  }

  // LastSavedItem
  get LastSavedItem(): any {
    let a: any = JSON.parse(localStorage.getItem("LastSavedItem"));
    if (a == undefined || a == null) {
      return {};
    }
    return a;
  }
  set LastSavedItem(value: any) {
    localStorage.setItem("LastSavedItem", JSON.stringify(value));
  }

  // Icons
  get IconList(): Array<string> {
    return [];
  }

  private usedIcons: Array<number> = [];

  public getIconRandom() {
    let a: number = this.IconList.length;
    let idx: number = Math.floor(Math.random() * a);
    return this.IconList[idx];
  }

  // CurrentView
  get CurrentView(): string {
    let a: any = JSON.parse(localStorage.getItem("CurrentView"));
    if (a == undefined || a == null || a == "") {
      return "Room";
    }
    return a;
  }
  set CurrentView(value: string) {
    localStorage.setItem("CurrentView", JSON.stringify(value));
  }

  // Lineitems
  get Lineitems(): Array<ILineitemDto> {
    let a: Array<ILineitemDto> = JSON.parse(localStorage.getItem("Lineitems"));
    if (a == undefined || a == null) {
      return new Array<ILineitemDto>();
    }
    return a;
  }
  set Lineitems(value: Array<ILineitemDto>) {
    localStorage.setItem("Lineitems", JSON.stringify(value));
  }

  // Suite16Categories
  get Suite16Categories(): Array<ISuite16CategoryDto> {
    let a: Array<ISuite16CategoryDto> = JSON.parse(localStorage.getItem("Suite16Categories"));
    if (a == undefined || a == null) {
      return new Array<ISuite16CategoryDto>();
    }
    return a;
  }
  set Suite16Categories(value: Array<ISuite16CategoryDto>) {
    localStorage.setItem("Suite16Categories", JSON.stringify(value));
  }

  // DigiDocLineitems
  get DigiDocLineitems(): Array<ILineitemDto> {
    let a: Array<ILineitemDto> = JSON.parse(localStorage.getItem("DigiDocLineitems"));
    if (a == undefined || a == null) {
      return new Array<ILineitemDto>();
    }
    return a;
  }
  set DigiDocLineitems(value: Array<ILineitemDto>) {
    localStorage.setItem("DigiDocLineitems", JSON.stringify(value));
  }

  // Suite16Category
  get Suite16Category(): ISuite16CategoryDto {
    let a: ISuite16CategoryDto = JSON.parse(localStorage.getItem("Suite16Category"));
    if (a == undefined || a == null) {
      return new ISuite16CategoryDto();
    }
    return a;
  }
  set Suite16Category(value: ISuite16CategoryDto) {
    localStorage.setItem("Suite16Category", JSON.stringify(value));
  }

  // Features
  get Features(): Array<IFeatureDto> {
    let a: Array<IFeatureDto> = JSON.parse(localStorage.getItem("Features"));
    if (a == undefined || a == null) {
      return new Array<IFeatureDto>();
    }
    return a;
  }
  set Features(value: Array<IFeatureDto>) {
    localStorage.setItem("Features", JSON.stringify(value));
  }

  // Suite16CategoryLineitems
  get Suite16CategoryLineitems(): Array<ISuite16CategoryLineitemDto> {
    let a: Array<ISuite16CategoryLineitemDto> = JSON.parse(localStorage.getItem("Suite16CategoryLineitems"));
    if (a == undefined || a == null) {
      return new Array<ISuite16CategoryLineitemDto>();
    }
    return a;
  }
  set Suite16CategoryLineitems(value: Array<ISuite16CategoryLineitemDto>) {
    localStorage.setItem("Suite16CategoryLineitems", JSON.stringify(value));
  }

  // SelectedSearchResult
  get SelectedSearchResultDetail(): ISearchResultDetailDto {
    let a: ISearchResultDetailDto = JSON.parse(localStorage.getItem("SelectedSearchResultDetail"));
    if (a == undefined || a == null) {
      return {} as ISearchResultDetailDto;
    }
    return a;
  }
  set SelectedSearchResultDetail(value: ISearchResultDetailDto) {
    localStorage.setItem("SelectedSearchResultDetail", JSON.stringify(value));
  }

  // QueryParams
  get QueryParams(): any {
    let a: any = JSON.parse(localStorage.getItem("QueryParams"));
    if (a == undefined || a == null) {
      return [];
    }
    return a;
  }
  set QueryParams(value: any) {
    localStorage.setItem("QueryParams", JSON.stringify(value));
  }

  // IsPropertiesFetched
  get IsPropertiesFetched(): boolean {
    let IsPropertiesFetched: boolean = JSON.parse(localStorage.getItem("IsPropertiesFetched"));
    return IsPropertiesFetched;
  }
  set IsPropertiesFetched(value: boolean) {
    localStorage.setItem("IsPropertiesFetched", JSON.stringify(value));
  }

  // IsMy
  get IsMy(): boolean {
    let IsMy: boolean = JSON.parse(localStorage.getItem("IsMy"));
    return IsMy;
  }
  set IsMy(value: boolean) {
    localStorage.setItem("IsMy", JSON.stringify(value));
  }

  // IsWishlist
  get IsWishlist(): boolean {
    let IsWishlist: boolean = JSON.parse(localStorage.getItem("IsWishlist"));
    return IsWishlist;
  }
  set IsWishlist(value: boolean) {
    localStorage.setItem("IsWishlist", JSON.stringify(value));
  }

  // IsMy
  get IsSuggest(): boolean {
    let IsSuggest: boolean = JSON.parse(localStorage.getItem("IsSuggest"));
    return IsSuggest;
  }
  set IsSuggest(value: boolean) {
    localStorage.setItem("IsSuggest", JSON.stringify(value));
  }

  // ProfileItemImages
  get ProfileItemImages(): Array<ProfileItemImageDto> {
    let ProfileItemImages: Array<ProfileItemImageDto> = JSON.parse(localStorage.getItem("ProfileItemImages"));
    return ProfileItemImages;
  }
  set ProfileItemImages(value: Array<ProfileItemImageDto>) {
    localStorage.setItem("ProfileItemImages", JSON.stringify(value));
  }

  // IsFirstLoadCompleted
  get IsFirstLoadCompleted(): boolean {
    let IsFirstLoadCompleted: boolean = JSON.parse(localStorage.getItem("IsFirstLoadCompleted"));
    return IsFirstLoadCompleted;
  }
  set IsFirstLoadCompleted(value: boolean) {
    localStorage.setItem("IsFirstLoadCompleted", JSON.stringify(value));
  }

  // IsSwitchingProperty
  get IsSwitchingProperty(): boolean {
    let IsSwitchingProperty: boolean = JSON.parse(localStorage.getItem("IsSwitchingProperty"));
    return IsSwitchingProperty;
  }
  set IsSwitchingProperty(value: boolean) {
    localStorage.setItem("IsSwitchingProperty", JSON.stringify(value));
  }

  // IsNewUserTypeSelected
  get IsNewUserTypeSelected(): boolean {
    let IsNewUserTypeSelected: boolean = JSON.parse(localStorage.getItem("IsNewUserTypeSelected"));
    return IsNewUserTypeSelected;
  }
  set IsNewUserTypeSelected(value: boolean) {
    localStorage.setItem("IsNewUserTypeSelected", JSON.stringify(value));
  }

  // NewSelectedUserType
  get NewSelectedUserTypeId(): number {
    let a: any = JSON.parse(localStorage.getItem("NewSelectedUserTypeId"));
    if (a == undefined || a == null || a == 0) {
      return 0;
    }
    return a;
  }
  set NewSelectedUserTypeId(value: number) {
    localStorage.setItem("NewSelectedUserTypeId", JSON.stringify(value));
  }

  // CompanyInformation
  get CompanyInformation(): ICompanyInformationDto {
    let a: any = JSON.parse(localStorage.getItem("CompanyInformation"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set CompanyInformation(value: ICompanyInformationDto) {
    localStorage.setItem("CompanyInformation", JSON.stringify(value));
  }

  // ----------------------------------------------------------->
  // ----------------------------------------------------------->
  // ----------------------------------------------------------->
  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public communicator: CommunicatorService,
    public menuController: MenuController,
    public platform: Platform,
    public router: Router,
    public uxNotifierService: UxNotifierService,
    public userTypesService: UserTypesService,
    public featuresService: FeaturesService,
    public inAppBrowser: InAppBrowser = null
  ) {
    console.log("constructor BasePage");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad BasePage");
  }

  // Home
  public goHome() {
    // DO NOT DELETE: Until understand why the below occurred
    // 12.25.19

    //this.navController.setRoot('MainPage');
    //this.navController.pop();
    //let a: any = this.navController.getViews();
    //this.navController.first();
    //this.navController.popTo(MainPage);
    //this.navController.getByIndex(0);

    //this.navController.popToRoot();

    // setting to WelcomePage, ItemsPage
    // doesn't work... won't even load the app...
    //this.navController.setRoot(WelcomePage);
    //this.navController.setRoot(ItemsPage);

    // changing to "SearchPage" works, which prooves the issue is something with the "MainPage"
    // crazy thing is that the page loads the first time the app is loaded, but when I try to go there via ..setRoot(..) it fails
    // i did just make changes to the page so now have to check...
    //this.navController.setRoot(SearchPage);

    localStorage.removeItem("ProfileItem");
    localStorage.removeItem("LineItem");
    localStorage.removeItem("ActiveItem");
    this.router.navigate(["dashboard"]);

    // NOTE!!!!
    // If I...
    // this.navController.setRoot(DashboardPage);
    // ... wont work... the app wont load...
    // TODO: Need to understand what is going on!
  }

  // Camera
  public launchCamera() {
    //let navigationExtras: NavigationExtras = {
    //	queryParams: {
    //		type: 'camera'
    //	}
    //};
    this.QueryParams = {
      type: "camera",
    };
    this.router.navigate(["item-edit"]);
  }

  // Barcode
  public launchBarcode() {
    localStorage.removeItem("ActiveAttachment");
    //let navigationExtras: NavigationExtras = {
    //	queryParams: {
    //		type: 'barcode'
    //	}
    //};
    this.QueryParams = {
      type: "barcode",
    };
    this.router.navigate(["item-edit"]);
  }

  // File Explorer
  public launchFileExplorer() {
    //let navigationExtras: NavigationExtras = {
    //	queryParams: {
    //		type: 'file'
    //	}
    //};
    this.QueryParams = {
      type: "file",
    };
    this.router.navigate(["item-edit"]);
  }

  // Bookmark
  public bookmark() {
    console.log("bookmark()");
    //this.AppInsights.trackTrace({ message: 'bookmark()' });
    localStorage.removeItem("ActiveAttachment");
    console.log(this.router.url);
    this.QueryParams = {
      type: "file",
    };
    try {
      //let view = this.navController.getActive();
      //let componentName = view.component.name;
      let componentName = "";

      if (this.platform.is("mobileweb")) {
        if (this.LineItem !== null && this.LineItem.Id !== undefined) {
          let activeItem: ActiveItem = new ActiveItem();
          let bookmark: IBookmarkDto = {} as IBookmarkDto;

          bookmark.Url = "http://www.google.com";
          activeItem.Bookmark = bookmark;
          activeItem.AssetInfo = {} as IAssetInfoDto;

          this.ActiveItem = activeItem;

          //let navigationExtras: NavigationExtras = {
          //	queryParams: {
          //		IsFromItemAddPage: true,
          //		type: 'Bookmark',
          //		source: componentName,
          //		//sourceParams: this.navParams.data
          //	}
          //};
          this.QueryParams = {
            IsFromItemAddPage: true,
            type: "Bookmark",
            source: componentName,
            returnRoute: this.router.url,
          };
          this.router.navigate(["item-edit"]);
        } else {
          //let navigationExtras: NavigationExtras = {
          //	queryParams: {
          //		Image: null,
          //		type: 'Bookmark',
          //		Url: 'http://www.google.com',
          //		source: componentName,
          //		//sourceParams: this.navParams.data
          //	}
          //};

          this.QueryParams = {
            Image: null,
            type: "Bookmark",
            Url: "http://www.google.com",
            source: componentName,
            returnRoute: this.router.url,
          };
          this.router.navigate(["item-add"]);
        }
      } else {
        // const options: ThemeableBrowserOptions = {
        //   statusbar: {
        //     color: "#000000",
        //   },
        //   toolbar: {
        //     height: 44,
        //     color: "#ffffff",
        //   },
        //   title: {
        //     color: "#000000",
        //     showPageTitle: true,
        //     staticText: "MyPad",
        //   },
        //   closeButton: {
        //     wwwImage: "assets/imgs/themeable-browser/times.png",
        //     align: "right",
        //     event: "closePressed",
        //   },
        //   customButtons: [
        //     {
        //       image: "assets/imgs/themeable-browser/home-icon.png",
        //       wwwImage: "assets/imgs/themeable-browser/home-icon.png",
        //       imagePressed: "share_pressed",
        //       align: "left",
        //       event: "home",
        //     },
        //     {
        //       image: "assets/imgs/themeable-browser/bookmark.png",
        //       wwwImage: "assets/imgs/themeable-browser/bookmark.png",
        //       imagePressed: "share_pressed",
        //       align: "left",
        //       event: "bookmark",
        //     },
        //     {
        //       image: "assets/imgs/themeable-browser/browse.png",
        //       wwwImage: "assets/imgs/themeable-browser/browse.png",
        //       imagePressed: "share_pressed",
        //       align: "left",
        //       event: "browse",
        //     },
        //   ],
        //   menu: {
        //     image: "assets/imgs/themeable-browser/bars.png",
        //     imagePressed: "assets/imgs/themeable-browser/bars.png",
        //     align: "left",
        //     items: [],
        //   },
        //   backButtonCanClose: false,
        // };

        // options.menu.items.push({ event: "home", label: "Home" });
        // options.menu.items.push({ event: "bookmark", label: "Bookmark" });
        // options.menu.items.push({ event: "browse", label: "Browse" });

        const browser = this.inAppBrowser.create("https://www.google.com", "_blank");

        browser.on("loadstart").subscribe(() => {
          browser.executeScript({
            code: "window.location.href ='http://www.google.com';",
          });
        });

        browser.on("message").subscribe((x: any) => {
          browser.close();
          if (this.LineItem.Id !== undefined) {
            let activeItem: ActiveItem = new ActiveItem();
            let bookmark: IBookmarkDto = {} as IBookmarkDto;

            bookmark.Url = x.url;
            activeItem.Bookmark = bookmark;
            activeItem.AssetInfo = {} as IAssetInfoDto;

            this.ActiveItem = activeItem;

            //let navigationExtras: NavigationExtras = {
            //	queryParams: {
            //		IsFromItemAddPage: true,
            //		'type': 'Bookmark',
            //		source: componentName,
            //		//sourceParams: this.navParams.data
            //	}
            //};

            this.QueryParams = {
              IsFromItemAddPage: true,
              type: "Bookmark",
              source: componentName,
              //sourceParams: this.navParams.data
            };
            this.router.navigate(["item-edit"]);
          } else {
            //this.navController.push('ItemAddPage', { 'Image': null, 'type': 'Bookmark', 'Url': x.url });
            //let navigationExtras: NavigationExtras = {
            //	queryParams: {
            //		'Image': null,
            //		'type': 'Bookmark',
            //		'Url': x.url
            //	}
            //};

            this.QueryParams = {
              Image: null,
              type: "Bookmark",
              Url: x.url,
            };
            this.router.navigate(["item-add"]);
          }
        });

        browser.on("loadstart").subscribe((x: any) => {
          browser.executeScript({
            code: "var url = prompt('Enter Url', 'https://www.');window.location.href=url;",
          });
        });
      }
    } catch (e) {
      //alert(JSON.stringify(e));
      this.AppInsights.trackException({ exception: e });
    }
  }

  // Search
  public search() {
    this.router.navigate(["search"]);
  }

  public openMenu() {
    let a: any = this.Properties;
    a.forEach((x) => {
      x.image = "assets/svgs/solid/home.svg";
    });

    this.communicator.sendProperties(a);
    this.menuController.open("propertyMenu");
  }

  get usersPlatform() {
    let platform = "android";
    if (this.platform.is("ios")) {
      platform = "ios";
    }
    return platform;
  }

  selectInput(event) {
    event.target.select();
  }

  // sort
  // sort()
  public compareLineitems(i1: ILineitemDto, i2: ILineitemDto): number {
    if (i1.Name > i2.Name) {
      return 1;
    } else {
      return -1;
    }
  }

  public async upgradeSubscription(featureId: number): Promise<boolean> {
    // show alert with ok option
    await this.featuresService.subscribe(featureId).then((x) => {
      // update the User object
      let tempUser: IUserDto = this.User;
      tempUser.Subscriptions.push(this.Features.filter((x) => x.Name === "DigiDoc")[0]);
      this.User = tempUser;
    });

    return true;
  }
}
