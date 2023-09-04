import { Component, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { AlertController, LoadingController, MenuController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IFeatureDto } from "src/app/models/dto/interfaces/IFeatureDto";
import { IGrid } from "src/app/models/dto/interfaces/IGrid";
import { IGridList } from "src/app/models/dto/interfaces/IGridList";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { INewPropertyDto } from "src/app/models/dto/interfaces/INewPropertyDto";
import { IProfileItemDto } from "src/app/models/dto/interfaces/IProfileItemDto";
import { ISuite16CategoryDto } from "src/app/models/dto/interfaces/ISuite16Category";
import { SegmentItem } from "src/app/models/SegmentItem";
import { CommunicatorService } from "src/app/services/communicator/communicator.service";
import { FeaturesService } from "src/app/services/features/features.service";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { Suite16CategoryService } from "src/app/services/suite16-category/suite16-category.service";
import { UserDetailsService } from "src/app/services/user-details/user-details.service";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { BasePage } from "../base/base.page";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage extends BasePage {
  // const
  public data: IGrid;
  public manageView: string = "rooms";
  public views: Array<SegmentItem> = [
    {
      name: "rooms",
      value: "rooms",
    },
    {
      name: "exteriors",
      value: "exteriors",
    },
    {
      name: "items",
      value: "items",
    },
  ];

  // privates
  commonAreas: Array<any> = new Array();
  bedRoomAreas: Array<any> = new Array();
  bathroomAreas: Array<any> = new Array();

  private _constants: Constants;

  activePropertyBedrooms: Array<any> = new Array();
  activePropertyBathrooms: Array<any> = new Array();
  activePropertyInteriorAreas: Array<any> = new Array();
  activePropertyExteriorAreas: Array<any> = new Array();

  private _selectedPropertySubscription: any;
  private _loading: any;

  // publics
  totalBedroomsSqFt: number = 0;
  totalBathroomsSqFt: number = 0;
  totalCommonAreasSqFt: number = 0;
  totalExteriorAreasSqFt: number = 0;

  bedroomToggle: boolean = false;
  bathroomToggle: boolean = false;
  commonAreaToggle: boolean = false;
  exteriorAreaToogle: boolean = false;

  public roomView: string = "default";

  constructor(
    public override navController: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public propertyService: PropertyProfilesService,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public url: DomSanitizer,
    public override router: Router,
    public override userTypesService: UserTypesService,
    public featureService: FeaturesService,
    public userDetailsService: UserDetailsService,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform,
    private suite16CategoryService: Suite16CategoryService,
    public override inAppBrowser: InAppBrowser,
    private activeRoute: ActivatedRoute,
    private ngzone: NgZone
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featureService, inAppBrowser);
    this._constants = new Constants();

    this.IsFirstLoadCompleted = false;
  }

  override async ngOnInit() {
    console.log("ngOnInit DashboardPage");
  }

  async ionViewDidEnter() {
    this.resetState();

    if (this.IsFirstLoadCompleted === undefined || this.IsFirstLoadCompleted === null || this.IsFirstLoadCompleted === false) {
      this._loading = await this.loadingCtrl.create({
        message: "loading properties...",
        cssClass: "my-loading-class",
      });
      await this._loading.present();

      setTimeout(async () => {
        await this.start();
        this.closeLoader();
      }, 1500);

      this.IsFirstLoadCompleted = true;
    } else {
      this.refreshPropertiesAsync();
    }

    // TODO: Should this be live?
    //if (this.CurrentView === 'Category') {
    //	this.showCategories();
    //}
  }

  async resetState() {
    // TODO: Remove magic strings
    localStorage.removeItem("ActiveAttachment");
    localStorage.removeItem("ActiveAttachmentItem");
    localStorage.removeItem("ActiveItem");
    localStorage.removeItem("LineItem");
    localStorage.removeItem("LastSavedItem");
    localStorage.removeItem("Metattachments");
    localStorage.removeItem("Suite16Category");
    localStorage.removeItem("IsMetattachment");
    localStorage.removeItem("Lineitems");
    localStorage.removeItem("ProfileItem");
    localStorage.removeItem("AssetIndex");
    localStorage.removeItem("DigiDocLineitems");
    localStorage.removeItem("Suite16CategoryLineitems");
    localStorage.removeItem("SearchSource");
    localStorage.removeItem("TempActiveItem");
    localStorage.removeItem("Selections");
    localStorage.removeItem("QueryParams");
    localStorage.removeItem("ProfileItemImages");
    localStorage.removeItem("Features");
    //localStorage.removeItem('Suite16Categories'); //TODO: Get in background
    localStorage.removeItem("IsPropertiesFetched");
    localStorage.removeItem("IsNewUserTypeSelected");
    localStorage.removeItem("NewSelectedUserTypeId");
  }

  public async start() {
    this.resetState();

    this.getSuite16Categories();

    this.activeRoute.queryParams.subscribe(async (params) => {
      if (params["delay"]) {
        setTimeout(() => {
          if (params["refreshActiveProperty"]) {
            this.getActivePropertyAreas(true);
          }

          if (params["addProperty"]) {
            this.getAllUserProperties();
          }
        }, 6000);
      } else {
        if (params["refreshActiveProperty"]) {
          this.getActivePropertyAreas(true);
        }

        if (params["addProperty"]) {
          this.getAllUserProperties();
        }
      }
    });

    // TODO: Fix 'refreshProperties' should be 'RefreshProperties'; should be handeled at BasePage?; why is
    // one in params and other localStorage?
    if (localStorage.getItem("refreshProperties")) {
      await this.refreshPropertiesAsync();
      localStorage.removeItem("refreshProperties");
    }

    if (this.CurrentView === "Category") {
      this.manageView = "items";
      this.manageCategories();
    }

    await this.getAreaTypes().then(
      (x) => {
        console.log("got common areas", this.commonAreas);

        this.menuController.enable(true, "propertyMenu");

        this.getSelectedProperty();

        this.url.bypassSecurityTrustResourceUrl;

        if (this.IsPropertiesFetched === null || !this.IsPropertiesFetched) {
          this.getAllUserProperties();
          this.IsPropertiesFetched = true;
        } else {
          this.setupProperty(this.ActiveProperty);
          this.communicator.sendProperties(this.Properties);
        }
      },
      (err) => {
        alert(`Error getting area types: ${JSON.stringify(err)}`);
      }
    );

    this.featuresService.getFeatures().then((x: Array<IFeatureDto>) => {
      this.Features = x;
    });
  }

  private async refreshPropertiesAsync() {
    this.Properties = [];
    this._loading = await this.loadingCtrl.create({
      message: "refreshing properties...",
      cssClass: "my-loading-class",
    });

    if (this.IsFirstLoadCompleted !== true) {
      await this._loading.present();
    }

    let userProperties: Array<INewPropertyDto> = this.Properties;

    for (let userType of this.User.Types) {
      await this.userDetailsService
        .getProperties(userType.Id)
        .then(
          (properties: Array<INewPropertyDto>) => {
            for (let property of properties) {
              userProperties.push(property);
            }
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

    this.Properties = userProperties;

    if (this.IsFirstLoadCompleted !== true) {
      if (this._loading != undefined) {
        this._loading.dismiss();
      }
    }
  }

  private async getAreaTypes() {
    await this.getInteriorAreas().then(
      (x) => {
        let bedRoomAreas = sessionStorage.getItem("bedroomAreas");
        let commonAreas = null; //sessionStorage.getItem('commonAreas');
        let bathroomAreas = sessionStorage.getItem("bathroomAreas");

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

        //TODO: why are we not getting commonAreas and exteriorAreas
      },
      (err) => {}
    );
  }

  private async getInteriorAreas() {
    await this.propertyService.getAreaTypes("interior").then((response: any) => {
      console.log(response);
      this.commonAreas = response;
      sessionStorage.setItem("commonAreas", JSON.stringify(this.commonAreas));
    });
  }

  private async getBedrooms() {
    this.propertyService.getAreaTypes("bedroom").then((response: Array<any>) => {
      this.bedRoomAreas = response;
      sessionStorage.setItem("bedroomAreas", JSON.stringify(this.bedRoomAreas));
    });
  }

  private async getBathroomAreas() {
    this.propertyService.getAreaTypes("bathroom").then((response: Array<any>) => {
      this.bathroomAreas = response;
      sessionStorage.setItem("bathroomAreas", JSON.stringify(this.bathroomAreas));
    });
  }

  private getSelectedProperty() {
    this._selectedPropertySubscription = this.communicator.getSelectedProperty().subscribe((property) => {
      this.IsSwitchingProperty = true;
      console.log(property, "selected property");
      this.viewProperty(property);
    });
  }

  private viewProperty(viewProperty) {
    this.ActiveProperty = viewProperty;
    this.getActivePropertyAreas(true);
  }

  private async getAllUserProperties() {
    this._loading = await this.loadingCtrl.create({
      message: "getting all properties...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();

    try {
      let userProperties: Array<INewPropertyDto> = new Array<INewPropertyDto>();
      let propertyCount = 0;

      if (this.User.Types != null && this.User.Types !== undefined && this.User.Types.length !== 0) {
        for (let userType of this.User.Types) {
          await this.userDetailsService
            .getProperties(userType.Id)
            .then(
              (properties: Array<INewPropertyDto>) => {
                propertyCount += properties.length;

                userProperties.push(...properties);

                if (properties.length === 0) {
                  return;
                }

                if (properties.length === 1) {
                  this.setupProperty(properties[0]);
                  //this.closeLoader();
                } else {
                  // TODO: Need to test this path!

                  // make the api call for the last ActiveProperty

                  // tried this and doesn't work, need to make the call to the api to
                  // get the property info
                  if (this.ActiveProperty !== null) {
                    if (this.ActiveProperty.IsProxy) {
                      if (this.ActiveProperty.Profiles === undefined || this.ActiveProperty.Profiles === null || this.ActiveProperty.Profiles.length === 0) {
                        this.userDetailsService.getProxyProperty(this.ActiveProperty.Id).then(
                          (x: any) => {
                            this.setupProperty(x);
                          },
                          (err) => {}
                        );
                      } else {
                        this.setupProperty(this.ActiveProperty);
                      }
                    } else {
                      if (this.ActiveProperty.Profiles == undefined || this.ActiveProperty.Profiles == null || this.ActiveProperty.Profiles.length == 0) {
                        this.userDetailsService.getProperty(this.ActiveProperty.Id).then(
                          (x: any) => {
                            this.setupProperty(x);

                            this.AppInsights.trackEvent({
                              name: "LoadingProperties",
                              properties: [
                                {
                                  userID: this.User.Id,
                                },
                                {
                                  userType: userType.Id,
                                },

                                {
                                  activeProperty: this.ActiveProperty.Id,
                                },
                              ],
                            });
                            //this.closeLoader();
                          },
                          (err) => {}
                        );
                      } else {
                        this.setupProperty(this.ActiveProperty);
                      }
                    }
                  } else {
                    this.setupProperty(properties[0]);
                    //this.closeLoader();
                  }
                }

                this.AppInsights.trackEvent({
                  name: "LoadingProperties-Done",
                  properties: [
                    {
                      userID: this.User.Id,
                    },
                  ],
                });

                this.communicator.sendProperties(properties);
              },
              (err) => {
                this.AppInsights.trackEvent({
                  name: "LoadingProperties-Error",
                  properties: [
                    {
                      userID: this.User.Id,
                    },
                  ],
                });

                this.AppInsights.trackException(err);
                if (err.status === 401) {
                  this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                  this.router.navigate(["sign-in"]);
                }
              }
            )
            .catch((error) => {
              this.AppInsights.trackEvent({
                name: "LoadingProperties-Error",
                properties: [
                  {
                    userID: this.User.Id,
                  },
                ],
              });

              this.AppInsights.trackException(error);

              console.log(error);
            });
        }
      }

      this.closeLoader();

      this.AppInsights.trackEvent({
        name: "end: getAllUserProperties()",
        properties: [
          {
            userID: this.User.Id,
          },
        ],
      });

      if (this.User.Types.some((x) => x.Name == this._constants.UserTypes.Unassigned)) {
        this.router.navigate(["user-types-selector"]);
      } else {
        if (propertyCount === 0) {
          this.router.navigate(["property-profiles"]);
        } else {
          this.Properties = userProperties;
        }
      }
    } catch (e) {
      this.AppInsights.trackException(e);
      console.log(`error: ${e}`);
      this.closeLoader();
    }
  }

  private closeLoader() {
    console.log("closeLoader()");
    if (this._loading != undefined) {
      console.log("_loading.dismiss() before");
      this._loading.dismiss();
      console.log("_loading.dismiss() after");
    }
  }

  // TODO: add access modifier
  move(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length;
      while (k-- + 1) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  // TODO: add access modifier
  openMainMenu() {
    this.menuController.enable(true, "mainMenu");
    this.menuController.open("mainMenu");
  }

  //selectView() {
  //	debugger;
  //	if (this.manageView == "items") {
  //		this.manageCategories();
  //	} else {
  //		this.manageRooms();
  //	}
  //}

  //ngOnDestroy() {
  //	// unsubscribe to ensure no memory leaks
  //	this._selectedPropertySubscription.unsubscribe();
  //}

  private setupProperty(property: INewPropertyDto) {
    this.ActiveProperty = property;
    this.getActivePropertyAreas();
  }

  public async getActivePropertyAreas(refreshProperty: boolean = false) {
    if (refreshProperty) {
      this._loading = await this.loadingCtrl.create({
        message: "Loading Property Areas...",
        cssClass: "my-loading-class",
      });
      if (this.IsFirstLoadCompleted !== true || this.IsSwitchingProperty === true) {
        await this._loading.present();
      }
    }

    let temp_totalBedroomsSqFt = 0;
    let temp_totalBathroomsSqFt = 0;
    let temp_totalCommonAreasSqFt = 0;
    let temp_totalExteriorAreasSqFt = 0;

    let temp_activePropertyBedrooms = [];
    let temp_activePropertyBathrooms = [];
    let temp_activePropertyInteriorAreas = [];
    let temp_activePropertyExteriorAreas = [];

    let that: any = this;

    if (this.ActiveProperty.Profiles === undefined || this.ActiveProperty.Profiles === null || this.ActiveProperty.Profiles.length === 0 || refreshProperty) {
      await this.userDetailsService.getProperty(this.ActiveProperty.Id).then(
        (x: any) => {
          this.ActiveProperty = x;

          if (refreshProperty) {
            if (this.IsFirstLoadCompleted !== true || this.IsSwitchingProperty === true) {
              this._loading.dismiss();
              this.IsSwitchingProperty = false;
            }
          }
        },
        (err) => {
          if (refreshProperty) {
            this._loading.dismiss();
          }

          this.uxNotifierService.showToast("An error occured getting some resources.", this._constants.ToastColorBad);
        }
      );
    }

    if (this.ActiveProperty.Profiles != undefined && this.ActiveProperty.Profiles != null && this.ActiveProperty.Profiles.length > 0) {
      this.ActiveProperty.Profiles.forEach((x) => {
        console.log(x.Area.Name, x.ProfileItems.length, x);
        // Bedrooms
        let a: any = that.bedRoomAreas.filter((y) => y.Id === x.Area.Id)[0];
        if (a && a !== null) {
          x.ProfileItems.forEach((b) => {
            temp_activePropertyBedrooms.push({
              Id: b.Id,
              Name: b.Name,
              SqFt: b.SqFt,
              Area: x.Area,
              ImageCount: b.ImageCount,
            });
            temp_totalBedroomsSqFt += b.SqFt;
          });
        }

        // Bathrooms
        a = that.bathroomAreas.filter((y) => y.Id === x.Area.Id)[0];
        if (a && a !== null) {
          x.ProfileItems.forEach((b) => {
            temp_activePropertyBathrooms.push({
              Id: b.Id,
              Name: b.Name,
              SqFt: b.SqFt,
              Area: x.Area,
              ImageCount: b.ImageCount,
            });
            temp_totalBathroomsSqFt += b.SqFt;
          });
        }

        // Interior Areas
        a = that.commonAreas.filter((y) => y.Id === x.Area.Id)[0];
        if (a && a !== null) {
          x.ProfileItems.forEach((b) => {
            temp_activePropertyInteriorAreas.push({
              Id: b.Id,
              Name: b.Name,
              SqFt: b.SqFt,
              Area: x.Area,
              ImageCount: b.ImageCount,
            });
            temp_totalCommonAreasSqFt += b.SqFt;
          });
        }

        // Exterior Areas
        if (x.Area.Type.Name.toLowerCase() === "exterior") {
          x.ProfileItems.forEach((b) => {
            temp_activePropertyExteriorAreas.push({
              Id: b.Id,
              Name: b.Name,
              SqFt: b.SqFt,
              Area: x.Area,
              ImageCount: b.ImageCount,
            });
            temp_totalExteriorAreasSqFt += b.SqFt;
          });
        }

        that.totalBedroomsSqFt = temp_totalBedroomsSqFt;
        that.totalBathroomsSqFt = temp_totalBathroomsSqFt;
        that.totalCommonAreasSqFt = temp_totalCommonAreasSqFt;
        that.totalExteriorAreasSqFt = temp_totalExteriorAreasSqFt;

        that.activePropertyBedrooms = temp_activePropertyBedrooms;
        that.activePropertyBathrooms = temp_activePropertyBathrooms;
        that.activePropertyInteriorAreas = temp_activePropertyInteriorAreas;
        that.activePropertyExteriorAreas = temp_activePropertyExteriorAreas;
      });
    }
  }

  public toogleViews(type) {
    if (type == "bedroom") {
      this.bedroomToggle = !this.bedroomToggle;
      this.bathroomToggle = false;
      this.commonAreaToggle = false;
      this.exteriorAreaToogle = false;
    } else if (type == "bathroom") {
      this.bathroomToggle = !this.bathroomToggle;
      this.bedroomToggle = false;
      this.commonAreaToggle = false;
      this.exteriorAreaToogle = false;
    } else if (type == "commonArea") {
      this.commonAreaToggle = !this.commonAreaToggle;
      this.bathroomToggle = false;
      this.bedroomToggle = false;
      this.exteriorAreaToogle = false;
    } else if (type == "exterior") {
      this.exteriorAreaToogle = !this.exteriorAreaToogle;
      this.commonAreaToggle = false;
      this.bathroomToggle = false;
      this.bedroomToggle = false;
    }
  }

  public showLineItems(profileItem: any) {
    let profileItemDto: IProfileItemDto = {} as IProfileItemDto;
    profileItemDto.Id = profileItem.Id;
    profileItemDto.Name = profileItem.Name;
    profileItemDto.AreaId = profileItem.Area.Id;
    profileItemDto.ItemCount = profileItem.ItemCount;
    this.ProfileItem = profileItemDto;

    this.QueryParams = {
      propertyName: this.ActiveProperty.StreetAddress1.substring(0, 4),
      profileItem: profileItem,
      profileName: profileItemDto.Name,
      propertyObject: this.ActiveProperty,
    };
    this.roomView = "default";
    this.router.navigate(["profile-items"]);
  }

  public editProfileItems(profileName, areaType) {
    this.QueryParams = {
      profileName: profileName,
      areaType: areaType,
      isAddExterior: false,
    };
    this.router.navigate(["edit-profile"]);
  }

  public addExterior() {
    this.QueryParams = {
      profileName: "exterior",
      areaType: "exterior",
      isAddExterior: true,
    };
    this.router.navigate(["edit-profile"]);
  }

  // TODO: add access modifier
  handleSegmentClick(text: string) {
    switch (text) {
      case "rooms":
        this.CurrentView = "Room";
        this.manageView = "rooms";
        break;
      case "exteriors":
        this.CurrentView = "Room";
        this.manageView = "exteriors";
        break;
      case "items":
        this.showCategories();
        break;
    }
  }

  private showCategories() {
    this.CurrentView = "Category";
    localStorage.removeItem("ProfileItem");
    this.manageView = "items";
    this.manageCategories();
  }

  private async manageCategories() {
    this.displaySuite16Categories();
  }

  private async displaySuite16Categories() {
    this.data = {
      Lists: [],
    };

    this.data.Lists = [
      {
        Name: "",
        Items: this.Suite16Categories.map((x: ISuite16CategoryDto) => {
          let icon: string = "";

          if ((x.ImageUrl == undefined || x.ImageUrl == null || x.ImageUrl == "") && (x.IconName == undefined || x.IconName == null || x.IconName == "")) {
            icon = this.getIconRandom();
          } else {
            if (x.ImageUrl != undefined && x.ImageUrl != null && x.ImageUrl != "") {
              icon = x.ImageUrl;
            } else {
              if (x.IconName != undefined && x.IconName != null && x.IconName != "") {
                icon = x.IconName;
              }
            }
          }

          const lineitemDto: ILineitemDto = {
            Id: x.Id,
            Name: x.Name,
            IconPath: icon,
          };

          return lineitemDto;
        }),
      },
    ];
  }

  public async getSuite16Categories() {
    if (this.Suite16Categories == undefined || this.Suite16Categories == null || this.Suite16Categories.length == 0) {
      await this.suite16CategoryService.getSuite16Categories().then(
        (x: Array<ISuite16CategoryDto>) => {
          this.Suite16Categories = x;
        },
        (err) => {
          this.uxNotifierService.showToast("An error occured getting some resources.", this._constants.ToastColorBad);

          if (this.Suite16Categories === undefined || this.Suite16Categories === null || this.Suite16Categories.length === 0) {
            //this.getSuite16Categories();
          }

          //alert(`err: getSuite16Categories() ${err}`);
        }
      );
    }
  }

  public suite16CategoryClickEventHandler(gridList: IGridList) {
    let suite16Category: ISuite16CategoryDto = new ISuite16CategoryDto();
    suite16Category.Id = gridList.Items[0].Id;
    suite16Category.Name = gridList.Items[0].Name;
    suite16Category.ImageUrl = gridList.Items[0].IconPath;
    this.Suite16Category = suite16Category;
    this.router.navigate(["line-items"]);
  }

  public async doRefresh(event) {
    this.getAllUserProperties().then(
      async (x) => {
        event.target.complete();
      },
      (error) => {
        event.complete();
      }
    );
  }
}
