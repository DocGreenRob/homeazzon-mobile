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
import { InAppBrowser, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-base",
  templateUrl: "./base.page.html",
  styleUrls: ["./base.page.scss"],
})
export class BasePage implements OnInit {
  ngOnInit() { }

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
    const token: IAuthTokenDto = this.storageService.get('AuthToken');
    return token;
  }
  set AuthToken(value: IAuthTokenDto) {
    this.storageService.set("AuthToken", value);
  }

  // IdToken
  get IdToken(): IdTokenDto {
    const tokenId: IdTokenDto = this.storageService.get('IdToken');
    return tokenId;
  }
  set IdToken(value: IdTokenDto) {
    this.storageService.set("IdToken", value);
  }

  // User
  get User(): IUserDto {
    let user: IUserDto = this.storageService.get('User');
    return user;
  }
  set User(value: IUserDto) {
    this.storageService.set("User", value);
  }

  // UserTypes
  get UserTypes(): Array<IUserTypeDto> {
    const types = this.storageService.get("UserTypes");
    return types ? types : [];
  }
  set UserTypes(value: Array<IUserTypeDto>) {
    this.storageService.set("UserTypes", value);
  }

  // CompanyTypes
  get CompanyTypes(): ICompanyTypesLookupDto {
    const companyTypes = this.storageService.get('CompanyTypes');
    return companyTypes;
  }
  set CompanyTypes(value: ICompanyTypesLookupDto) {
    this.storageService.set("CompanyTypes", value);
  }

  // ActiveProperty
  get ActiveProperty(): INewPropertyDto {
    const activeProperty = this.storageService.get('ActiveProperty');
    return activeProperty;
  }
  set ActiveProperty(value: INewPropertyDto) {
    this.storageService.set("ActiveProperty", value);
  }

  // CustomProperty
  get CustomProperty(): IPropertyDto {
    const prop: IPropertyDto = this.storageService.get('CustomProperty');
    return prop;
  }
  set CustomProperty(value: IPropertyDto) {
    this.storageService.set("CustomProperty", value);
  }

  // Properties
  get Properties(): Array<INewPropertyDto> {
    const newProp: Array<INewPropertyDto> = this.storageService.get('Properties');
    return newProp ? newProp : [];
  }
  set Properties(value: Array<INewPropertyDto>) {
    this.storageService.set("Properties", value);
  }

  // ProfileItem
  get ProfileItem(): IProfileItemDto {
    const item: IProfileItemDto = this.storageService.get('ProfileItem');
    return item ? item : { Id: 0, AreaId: 0, Name: "" };
  }
  set ProfileItem(value: IProfileItemDto) {
    this.storageService.set("ProfileItem", value);
  }

  // Lineitem
  get LineItem(): ILineitemDto {
    const item: ILineitemDto = this.storageService.get('LineItem');
    return item;
  }
  set LineItem(value: ILineitemDto) {
    this.storageService.set("LineItem", value);
  }

  // ProfileItemLineItems
  get ProfileItemLineItems(): Array<ILineitemDto> {
    const profileItem: Array<ILineitemDto> = this.storageService.get('ProfileItemLineItems');
    return profileItem ? profileItem : [];
  }
  set ProfileItemLineItems(value: Array<ILineitemDto>) {
    this.storageService.set("ProfileItemLineItems", value);
  }

  // ActiveItem
  get ActiveItem(): ActiveItem {
    const item: ActiveItem = this.storageService.get('ActiveItem');

    if (item) {
      return item;
    } else {
      const activeItem: ActiveItem = new ActiveItem();
      activeItem.AssetInfo = new AssetInfoDto();
      return activeItem;
    }
  }
  set ActiveItem(value: ActiveItem) {
    this.storageService.set("ActiveItem", value);
  }

  // ActiveAttachmentItem
  get ActiveAttachmentItem(): ActiveItem {
    const item: ActiveItem = this.storageService.get("ActiveAttachmentItem");
    if (item) {
      return item;
    } else {
      const activeItem: ActiveItem = new ActiveItem();
      activeItem.AssetInfo = new AssetInfoDto();
      return activeItem;
    }
  }
  set ActiveAttachmentItem(value: ActiveItem) {
    this.storageService.set("ActiveAttachmentItem", value);
  }

  // Metattachments
  get Metattachments(): Array<Array<IMetattachmentDto>> {
    const meta: Array<Array<IMetattachmentDto>> = this.storageService.get("Metattachments");
    return meta ? meta : new Array<Array<IMetattachmentDto>>();
  }
  set Metattachments(value: Array<Array<IMetattachmentDto>>) {
    this.storageService.set("Metattachments", value);
  }

  // IsMetattachment
  get IsMetattachment(): boolean {
    const meta: boolean = this.storageService.get("IsMetattachment");
    return meta ? meta : false;
  }
  set IsMetattachment(value: boolean) {
    this.storageService.set("IsMetattachment", value);
  }

  // ActiveAttachment
  get ActiveAttachment(): IMetattachmentDto {
    const active: IMetattachmentDto = this.storageService.get("ActiveAttachment");
    return active;
  }
  set ActiveAttachment(value: IMetattachmentDto) {
    this.storageService.set("ActiveAttachment", value);
  }

  // AssetIndex
  get AssetIndex(): AssetIndexDto {
    const asset: AssetIndexDto = this.storageService.get("AssetIndex");
    return asset;
  }
  set AssetIndex(value: AssetIndexDto) {
    this.storageService.set("AssetIndex", value);
  }

  // LastSavedItem
  get LastSavedItem(): any {
    const saveItem: any = this.storageService.get("LastSavedItem");
    return saveItem ? saveItem : {};
  }
  set LastSavedItem(value: any) {
    this.storageService.set("LastSavedItem", value);
  }

  // Icons
  get IconList(): Array<string> {
    return [];
  }

  public getIconRandom() {
    const a: number = this.IconList.length;
    const idx: number = Math.floor(Math.random() * a);
    return this.IconList[idx];
  }

  // CurrentView
  get CurrentView(): string {
    const vew: any = this.storageService.get("CurrentView");
    return vew?.length ? vew : "Room";
  }
  set CurrentView(value: string) {
    this.storageService.set("CurrentView", value);
  }

  // Lineitems
  get Lineitems(): Array<ILineitemDto> {
    const lineItem: Array<ILineitemDto> = this.storageService.get("Lineitems");
    return lineItem ? lineItem : [];
  }
  set Lineitems(value: Array<ILineitemDto>) {
    this.storageService.set("Lineitems", value);
  }

  // Suite16Categories
  get Suite16Categories(): Array<ISuite16CategoryDto> {
    const suite: Array<ISuite16CategoryDto> = this.storageService.get("Suite16Categories");
    return suite ? suite : [];
  }
  set Suite16Categories(value: Array<ISuite16CategoryDto>) {
    this.storageService.set("Suite16Categories", value);
  }

  // DigiDocLineitems
  get DigiDocLineitems(): Array<ILineitemDto> {
    const digiDoc: Array<ILineitemDto> = this.storageService.get("DigiDocLineitems");
    return digiDoc ? digiDoc : [];
  }
  set DigiDocLineitems(value: Array<ILineitemDto>) {
    this.storageService.set("DigiDocLineitems", value);
  }

  // Suite16Category
  get Suite16Category(): ISuite16CategoryDto {
    const suite: ISuite16CategoryDto = this.storageService.get("Suite16Category");
    return suite ? suite : new ISuite16CategoryDto();
  }
  set Suite16Category(value: ISuite16CategoryDto) {
    this.storageService.set("Suite16Category", value);
  }

  // Features
  get Features(): Array<IFeatureDto> {
    const feature: Array<IFeatureDto> = this.storageService.get("Features");
    return feature ? feature : [];
  }
  set Features(value: Array<IFeatureDto>) {
    this.storageService.set("Features", value);
  }

  // Suite16CategoryLineitems
  get Suite16CategoryLineitems(): Array<ISuite16CategoryLineitemDto> {
    const suite: Array<ISuite16CategoryLineitemDto> = this.storageService.get("Suite16CategoryLineitems");
    return suite ? suite : [];
  }
  set Suite16CategoryLineitems(value: Array<ISuite16CategoryLineitemDto>) {
    this.storageService.set("Suite16CategoryLineitems", value);
  }

  // SelectedSearchResult
  get SelectedSearchResultDetail(): ISearchResultDetailDto {
    const search: ISearchResultDetailDto = this.storageService.get("SelectedSearchResultDetail");
    return search ? search : {} as ISearchResultDetailDto;
  }
  set SelectedSearchResultDetail(value: ISearchResultDetailDto) {
    this.storageService.set("SelectedSearchResultDetail", value);
  }

  // QueryParams
  get QueryParams(): any {
    const params: any = this.storageService.get("QueryParams");
    return params ? params : [];
  }
  set QueryParams(value: any) {
    this.storageService.set("QueryParams", value);
  }

  // IsPropertiesFetched
  get IsPropertiesFetched(): boolean {
    const IsPropertiesFetched: boolean = this.storageService.get("IsPropertiesFetched");
    return IsPropertiesFetched;
  }
  set IsPropertiesFetched(value: boolean) {
    this.storageService.set("IsPropertiesFetched", value);
  }

  // IsMy
  get IsMy(): boolean {
    const IsMy: boolean = this.storageService.get("IsMy");
    return IsMy;
  }
  set IsMy(value: boolean) {
    this.storageService.set("IsMy", value);
  }

  // IsWishlist
  get IsWishlist(): boolean {
    const IsWishlist: boolean = this.storageService.get("IsWishlist");
    return IsWishlist;
  }
  set IsWishlist(value: boolean) {
    this.storageService.set("IsWishlist", value);
  }

  // IsMy
  get IsSuggest(): boolean {
    const IsSuggest: boolean = this.storageService.get("IsSuggest");
    return IsSuggest;
  }
  set IsSuggest(value: boolean) {
    this.storageService.set("IsSuggest", value);
  }

  // ProfileItemImages
  get ProfileItemImages(): Array<ProfileItemImageDto> {
    const ProfileItemImages: Array<ProfileItemImageDto> = this.storageService.get("ProfileItemImages");
    return ProfileItemImages ? ProfileItemImages : [];
  }
  set ProfileItemImages(value: Array<ProfileItemImageDto>) {
    this.storageService.set("ProfileItemImages", value);
  }

  // IsFirstLoadCompleted
  get IsFirstLoadCompleted(): boolean {
    const IsFirstLoadCompleted: boolean = this.storageService.get("IsFirstLoadCompleted");
    return IsFirstLoadCompleted;
  }
  set IsFirstLoadCompleted(value: boolean) {
    this.storageService.set("IsFirstLoadCompleted", value);
  }

  // IsSwitchingProperty
  get IsSwitchingProperty(): boolean {
    const IsSwitchingProperty: boolean = this.storageService.get("IsSwitchingProperty");
    return IsSwitchingProperty;
  }
  set IsSwitchingProperty(value: boolean) {
    this.storageService.set("IsSwitchingProperty", value);
  }

  // IsNewUserTypeSelected
  get IsNewUserTypeSelected(): boolean {
    const IsNewUserTypeSelected: boolean = this.storageService.get("IsNewUserTypeSelected");
    return IsNewUserTypeSelected;
  }
  set IsNewUserTypeSelected(value: boolean) {
    this.storageService.set("IsNewUserTypeSelected", value);
  }

  // NewSelectedUserType
  get NewSelectedUserTypeId(): number {
    const user: any = this.storageService.get("NewSelectedUserTypeId");
    return user ? user : 0;
  }
  set NewSelectedUserTypeId(value: number) {
    this.storageService.set("NewSelectedUserTypeId", value);
  }

  // CompanyInformation
  get CompanyInformation(): ICompanyInformationDto {
    const info: any = this.storageService.get("CompanyInformation");
    return info;
  }
  set CompanyInformation(value: ICompanyInformationDto) {
    this.storageService.set("CompanyInformation", value);
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
    public inAppBrowser: InAppBrowser = null,
    public storageService: LocalStorageService
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

    this.storageService.delete("ProfileItem");
    this.storageService.delete("LineItem");
    this.storageService.delete("ActiveItem");
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
    this.storageService.delete("ActiveAttachment");
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
    this.storageService.delete("ActiveAttachment");
    console.log(this.router.url);
    this.QueryParams = {
      type: "file",
    };
    try {
      // let view = this.navController.getActive();
      // let componentName = view.component.name;
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

        const options: InAppBrowserOptions = {
          toolbarcolor: '#c36d23',
          navigationbuttoncolor: '#000000',
          closebuttoncolor: '#000000',
          hidenavigationbuttons: 'no',
          hideurlbar: 'no', // Assuming you want the URL bar to be visible
          fullscreen: 'yes', // To use the full screen
          clearcache: 'yes',
          cleardata: 'yes',
          clearsessioncache: 'yes'
        };

        const browser = this.inAppBrowser.create("https://www.google.com", "_blank", options);

        browser.executeScript({
        code: `
          var button = document.createElement('button');
          button.innerText = 'Custom Button';
          button.style.position = 'fixed';
          button.style.left = '20px';
          button.style.bottom = '20px';
          button.style.zIndex = '1000';
          button.onclick = function() {
            alert('button clicked'); window.postMessage({ type: 'bookmark' }, '*');
          };
          document.body.appendChild(button);
        `
        });

        browser.executeScript({
          code: `
                var button = document.createElement('button');
                button.innerText = 'Home';
                button.onclick = function() { window.location.href ='https://www.google.com'; };
                document.body.appendChild(button);
              `
        });

        browser.executeScript({
          code: `
              var button = document.createElement('button');
              button.innerText = 'Bookmark';
              button.onclick = function() { window.postMessage({ type: 'bookmark' }, '*'); };
              document.body.appendChild(button);
            `
        });

        browser.executeScript({
          code: `
                var button = document.createElement('button');
                button.innerText = 'Browse';
                button.onclick = function() { var url = prompt('Enter Url', 'https://www.');window.location.href=url; };
                document.body.appendChild(button);
              `
        });

        let defaultUrl: string = "https://www.google.com";

        browser.on("loadstart").subscribe((x) => {

          if (x.url != defaultUrl) {
            defaultUrl = x.url;
            browser.executeScript({
              code: `window.location.href ='${defaultUrl}';`,
            });
          }

        });

        browser.on("message").subscribe((x: any) => {
          alert(JSON.stringify(x));

          if (x.data.type === 'bookmark') {
            browser.close();
            if (this.LineItem.Id !== undefined) {
              let activeItem: ActiveItem = new ActiveItem();
              let bookmark: IBookmarkDto = {} as IBookmarkDto;

              bookmark.Url = x.url;
              activeItem.Bookmark = bookmark;
              activeItem.AssetInfo = {} as IAssetInfoDto;

              this.ActiveItem = activeItem;

              this.QueryParams = {
                IsFromItemAddPage: true,
                type: "Bookmark",
                source: componentName
              };
              this.router.navigate(["item-edit"]);
            } else {

              this.QueryParams = {
                Image: null,
                type: "Bookmark",
                Url: x.url,
              };
              this.router.navigate(["item-add"]);
            }
          }

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
