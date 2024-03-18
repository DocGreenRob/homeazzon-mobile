import { Component, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Constants } from 'src/app/common/Constants';
import { IFeatureDto } from 'src/app/models/dto/interfaces/IFeatureDto';
import { IGrid } from 'src/app/models/dto/interfaces/IGrid';
import { IGridList } from 'src/app/models/dto/interfaces/IGridList';
import { ILineitemDto } from 'src/app/models/dto/interfaces/ILineItemDto';
import { INewPropertyDto } from 'src/app/models/dto/interfaces/INewPropertyDto';
import { IProfileItemDto } from 'src/app/models/dto/interfaces/IProfileItemDto';
import { ISuite16CategoryDto } from 'src/app/models/dto/interfaces/ISuite16Category';
import { SegmentItem } from 'src/app/models/SegmentItem';
import { CommunicatorService } from 'src/app/services/communicator/communicator.service';
import { FeaturesService } from 'src/app/services/features/features.service';
import { PropertyProfilesService } from 'src/app/services/property-profile/property-profiles.service';
import { Suite16CategoryService } from 'src/app/services/suite16-category/suite16-category.service';
import { UserDetailsService } from 'src/app/services/user-details/user-details.service';
import { UserTypesService } from 'src/app/services/user-types/user-types.service';
import { UxNotifierService } from 'src/app/services/uxNotifier/ux-notifier.service';
import { BasePage } from '../base/base.page';
import { forkJoin } from 'rxjs';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends BasePage {
  public isPrivateLabeler: boolean = false;
  public isProxyProperty: boolean = false;

  private _constants = new Constants();
  public isIos: boolean = false;
  spinnerText: string = 'Loading...';
  loading1Visible: boolean = false;

  spinnerText2: string = 'Loading...';
  loading2Visible: boolean = false;

  spinnerText3: string = 'Loading...';
  loading3Visible: boolean = false;

  spinnerText4: string = 'Loading...';
  loading4Visible: boolean = false;

  // const
  public data: IGrid;
  public manageView: string = 'rooms';
  public views: Array<SegmentItem> = [
    {
      name: 'rooms',
      value: 'rooms',
    },
    {
      name: 'exteriors',
      value: 'exteriors',
    },
    {
      name: 'items',
      value: 'items',
    },
  ];

  // privates
  commonAreas: Array<any> = new Array();
  bedRoomAreas: Array<any> = new Array();
  bathroomAreas: Array<any> = new Array();

  //private _constants: Constants;

  activePropertyBedrooms: Array<any> = new Array();
  activePropertyBathrooms: Array<any> = new Array();
  activePropertyInteriorAreas: Array<any> = new Array();
  activePropertyExteriorAreas: Array<any> = new Array();

  private _selectedPropertySubscription: any;
  private _loading: any;
  //private _constants: any;

  // publics
  totalBedroomsSqFt: number = 0;
  totalBathroomsSqFt: number = 0;
  totalCommonAreasSqFt: number = 0;
  totalExteriorAreasSqFt: number = 0;

  bedroomToggle: boolean = false;
  bathroomToggle: boolean = false;
  commonAreaToggle: boolean = false;
  exteriorAreaToogle: boolean = false;

  public roomView: string = 'default';

  constructor(public override navController: NavController,
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
    private ngzone: NgZone,
    public override storageService: LocalStorageService) {
    super(
      navController,
      null,
      communicator,
      menuController,
      platform,
      router,
      uxNotifierService,
      userTypesService,
      featureService,
      inAppBrowser,
      storageService
    );
    this._constants = new Constants();

    this.IsFirstLoadCompleted = false;

    this.isIos = this.platform.is('ios');
  }

  override async ngOnInit() {
    console.log('ngOnInit DashboardPage');
  }

  async ionViewDidEnter() {
    const u = this.User;
    this.isPrivateLabeler = u.IsPrivateLabelPartner;

    this.resetState();
    if (this.IsFirstLoadCompleted === undefined
      || this.IsFirstLoadCompleted === null
      || this.IsFirstLoadCompleted === false) {


      this.presentSpinner("loading properties...")

      setTimeout(async () => {
        try {
          await this.start();
          this.dismissSpinner();
        } catch (error) {
          this.AppInsights.trackEvent({
            name: 'LoadingProperties-Error',
            properties: [
              {
                userID: this.User.Id,
              },
            ],
          });

          this.AppInsights.trackException(error);

          console.log(error);
        }
      }, 1500);

      this.IsFirstLoadCompleted = true;
    } else {
      this.refreshPropertiesAsync();
    }

    // TODO: Should this be live?
    //if (this.CurrentView === 'Category') {
    //	this.showCategories();
    //}

    this.storageService.delete('IsAddingNewProperty');
    this.storageService.delete('SelectedProperty');
    this.storageService.delete('IsEditingProperty');
    this.storageService.delete('IsSwitchingProperty');
    this.storageService.delete('CustomProperty');
    this.storageService.delete('NewSelectedUserType');

  }

  async resetState() {
    // TODO: Remove magic strings
    //this.storageService.delete('ActiveProperty'); // Robert 2.11.24 - Keep this for better UX. If the user is in the middle of something, don't reset the property.
    this.storageService.delete('ActiveAttachment');
    this.storageService.delete('ActiveAttachmentItem');
    this.storageService.delete('ActiveItem');
    this.storageService.delete('LineItem');
    this.storageService.delete('LastSavedItem');
    this.storageService.delete('Metattachments');
    this.storageService.delete('Suite16Category');
    this.storageService.delete('IsMetattachment');
    this.storageService.delete('IsWishlist');
    this.storageService.delete('IsSuggest');
    this.storageService.delete('IsMy');
    this.storageService.delete('Lineitems');
    this.storageService.delete('ProfileItem');
    this.storageService.delete('AssetIndex');
    this.storageService.delete('DigiDocLineitems');
    this.storageService.delete('Suite16CategoryLineitems');
    this.storageService.delete('SearchSource');
    this.storageService.delete('TempActiveItem');
    this.storageService.delete('Selections');
    this.storageService.delete('QueryParams');
    this.storageService.delete('ProfileItemImages');
    this.storageService.delete('Features');
    //this.storageService.delete('Suite16Categories'); //TODO: Get in background
    this.storageService.delete('IsPropertiesFetched');
    this.storageService.delete('IsNewUserTypeSelected');
    this.storageService.delete('NewSelectedUserTypeId');
  }

  public async start() {
    try {
      this.resetState();

      this.getSuite16Categories();

      this.activeRoute.queryParams.subscribe(async (params) => {
        if (params['delay']) {
          setTimeout(() => {
            if (params['refreshActiveProperty']) {
              this.getActivePropertyAreas(true);
            }

            if (params['addProperty']) {
              this.getAllUserProperties();
            }
          }, 6000);
        } else {
          if (params['refreshActiveProperty']) {
            this.getActivePropertyAreas(true);
          }

          if (params['addProperty']) {
            this.getAllUserProperties();
          }
        }
      });

      // TODO: Fix 'refreshProperties' should be 'RefreshProperties'; should be handeled at BasePage?; why is
      // one in params and other localStorage?
      if (this.storageService.get('refreshProperties')) {
        await this.refreshPropertiesAsync();
        this.storageService.delete('refreshProperties');
      }

      if (this.CurrentView === 'Category') {
        this.manageView = 'items';
        this.manageCategories();
      }

      await this.getAreaTypes().then(
        (x) => {
          this.menuController.enable(true, 'propertyMenu');

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
          // TODO: Change to use uxNotifierService
          alert(`Error getting area types: ${JSON.stringify(err)}`);
        }
      );

      this.featuresService.getFeatures().then((x: Array<IFeatureDto>) => {
        console.log('abid');
        this.Features = x;
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async refreshPropertiesAsync() {
    this.Properties = [];


    if (this.IsFirstLoadCompleted !== true) {
      this.presentSpinner3('refreshing properties...');
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
              this.uxNotifierService.presentSimpleAlert(
                'Your credentials expired, please login again.',
                'Error'
              );
              this.router.navigate(['sign-in']);
            }
          }
        )
        .catch((error) => {
          console.log(error);
        });
    }

    this.Properties = userProperties;

    const allProps = forkJoin([userProperties]);
    allProps.subscribe({
      complete: () => {
        if (this.IsFirstLoadCompleted !== true) {
          this.dismissSpinner3();
        }
      }
    });

  }

  private async getAreaTypes() {
    await this.getInteriorAreas().then(
      (x) => {
        let bedRoomAreas = sessionStorage.getItem('bedroomAreas');
        let commonAreas = sessionStorage.getItem('commonAreas');
        let bathroomAreas = sessionStorage.getItem('bathroomAreas');

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
      (err) => { }
    );
  }

  private async getInteriorAreas() {
    this.propertyService
      .getAreaTypes('interior')
      .then((response: any) => {
        this.commonAreas = response;
        sessionStorage.setItem('commonAreas', JSON.stringify(this.commonAreas));
      })
      .catch((error) => {
        console.log('abid with asad and error');

        this.AppInsights.trackEvent({
          name: 'LoadingProperties-Error',
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

  private async getBedrooms() {
    this.propertyService
      .getAreaTypes('bedroom')
      .then((response: Array<any>) => {
        this.bedRoomAreas = response;
        sessionStorage.setItem(
          'bedroomAreas',
          JSON.stringify(this.bedRoomAreas)
        );
      })
      .catch((error) => {
        this.AppInsights.trackEvent({
          name: 'LoadingProperties-Error',
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

  private async getBathroomAreas() {
    this.propertyService
      .getAreaTypes('bathroom')
      .then((response: Array<any>) => {
        this.bathroomAreas = response;
        sessionStorage.setItem(
          'bathroomAreas',
          JSON.stringify(this.bathroomAreas)
        );
      })
      .catch((error) => {
        this.AppInsights.trackEvent({
          name: 'LoadingProperties-Error',
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

  private getSelectedProperty() {
    this._selectedPropertySubscription = this.communicator.getSelectedProperty().subscribe((property) => {
      this.IsSwitchingProperty = true;
      console.log(property, 'selected property');
      this.viewProperty(property);
    });
  }

  private viewProperty(viewProperty) {
    this.ActiveProperty = viewProperty;
    this.getActivePropertyAreas(true);
  }

  private async getAllUserProperties() {
    this.presentSpinner2("getting all properties...");

    try {
      let userProperties: Array<INewPropertyDto> = new Array<INewPropertyDto>();
      let propertyCount = 0;

      if (this.User.Types != null
        && this.User.Types !== undefined
        && this.User.Types.length !== 0) {
        for (let userType of this.User.Types) {
          await this.userDetailsService.getProperties(userType.Id).then((properties: Array<INewPropertyDto>) => {
            propertyCount += properties.length;

            userProperties.push(...properties);

            if (properties.length === 0) {
              return;
            }

            if (!this.ActiveProperty || properties[0].IsDefault === true) {
              this.setupProperty(properties[0]);
            }

            this.viewProperty(this.ActiveProperty);

            // TODO: Need to test this path!

            // make the api call for the last ActiveProperty
            // tried this and doesn't work, need to make the call to the api to
            // get the property info
            if (this.ActiveProperty.IsProxy) {
              this.isProxyProperty = true;
              if (!this.ActiveProperty.Profiles?.length) {
                this.userDetailsService.getProxyProperty(this.ActiveProperty.Id).then((x: any) => {
                  this.setupProperty(x);
                },
                  (err) => { }
                ).catch((error) => {
                  this.AppInsights.trackEvent({
                    name: 'LoadingProperties-Error',
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
            } else {
              if (this.ActiveProperty.Profiles == undefined
                || this.ActiveProperty.Profiles == null
                || this.ActiveProperty.Profiles.length == 0) {
                this.userDetailsService.getProperty(this.ActiveProperty.Id).then(
                  (x: any) => {
                    this.setupProperty(x);

                    this.AppInsights.trackEvent({
                      name: 'LoadingProperties',
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
                  (err) => { }
                ).catch((error) => {
                  this.AppInsights.trackEvent({
                    name: 'LoadingProperties-Error',
                    properties: [
                      {
                        userID: this.User.Id,
                      },
                    ],
                  });

                  this.AppInsights.trackException(error);

                  console.log(error);
                });
              } else {
                this.setupProperty(this.ActiveProperty);
              }
            }

            this.AppInsights.trackEvent({
              name: 'LoadingProperties-Done',
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
                name: 'LoadingProperties-Error',
                properties: [
                  {
                    userID: this.User.Id,
                  },
                ],
              });

              this.AppInsights.trackException(err);
              if (err.status === 401) {
                this.uxNotifierService.presentSimpleAlert(
                  'Your credentials expired, please login again.',
                  'Error'
                );
                this.router.navigate(['sign-in']);
              }
            }
          )
            .catch((error) => {
              this.AppInsights.trackEvent({
                name: 'LoadingProperties-Error',
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

      const allProps = forkJoin([userProperties]);
      allProps.subscribe({
        complete: () => {
          this.dismissSpinner2();
        }
      });

      this.AppInsights.trackEvent({
        name: 'end: getAllUserProperties()',
        properties: [
          {
            userID: this.User.Id,
          },
        ],
      });

      if (!this.User?.Types?.length || this.User?.Types?.some((x) => x.Name == this._constants.UserTypes.Unassigned)) {
        this.router.navigate(['user-types-selector']);
      } else {
        if (propertyCount === 0) {
          this.router.navigate(['property-profiles']);
        } else {
          this.Properties = userProperties;
        }
      }
    } catch (e) {
      this.AppInsights.trackException(e);
      console.log(`error: ${e}`);
      this.dismissSpinner2();
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
    this.menuController.enable(true, 'mainMenu');
    this.menuController.open('mainMenu');
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
    console.log('------------------------->setupProperty', property);
    this.ActiveProperty = property;
    this.getActivePropertyAreas();
  }

  public async getActivePropertyAreas(refreshProperty: boolean = false) {
    if (refreshProperty) {

      if (this.IsFirstLoadCompleted !== true || this.IsSwitchingProperty === true) {
        this.presentSpinner4('Loading Property Areas...');
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

    if (this.ActiveProperty.Profiles === undefined ||
      this.ActiveProperty.Profiles === null ||
      this.ActiveProperty.Profiles.length === 0 ||
      refreshProperty) {
      if (!this.ActiveProperty.IsProxy) {
        await this.userDetailsService
          .getProperty(this.ActiveProperty.Id)
          .then(
            (x: any) => {
              this.ActiveProperty = x;

              if (refreshProperty) {
                if (this.IsFirstLoadCompleted !== true || this.IsSwitchingProperty === true) {

                  this.dismissSpinner4();
                  this.IsSwitchingProperty = false;
                }
              }
            },
            (err) => {
              if (refreshProperty) {

                this.dismissSpinner4();
              }

              this.uxNotifierService.showToast('An error occured getting some resources. Pulldown to refresh.', this._constants.ToastColorBad);
            }
          )
          .catch((error) => {
            this.AppInsights.trackEvent({
              name: 'LoadingProperties-Error',
              properties: [
                {
                  userID: this.User.Id,
                },
              ],
            });

            this.AppInsights.trackException(error);

            console.log(error);
          });
      } else {
        this.isProxyProperty = true;

        await this.userDetailsService
          .getProxyProperty(this.ActiveProperty.Id)
          .then(
            (x: any) => {
              this.ActiveProperty = x;

              this.dismissSpinner4();

              if (refreshProperty) {
                if (this.IsFirstLoadCompleted !== true || this.IsSwitchingProperty === true) {

                  this.dismissSpinner4();
                  this.IsSwitchingProperty = false;
                }
              }
            },
            (err) => {
              if (refreshProperty) {

                this.dismissSpinner4();
              }

              this.uxNotifierService.showToast('An error occured getting some resources. Pulldown to refresh.', this._constants.ToastColorBad);
            }
          )
          .catch((error) => {
            this.AppInsights.trackEvent({
              name: 'LoadingProperties-Error',
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

    if (this.ActiveProperty.Profiles != undefined &&
      this.ActiveProperty.Profiles != null &&
      this.ActiveProperty.Profiles.length > 0) {
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
        if (x.Area.Type.Name.toLowerCase() === 'exterior') {
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

        //that.totalBedroomsSqFt = temp_totalBedroomsSqFt;
        //that.totalBathroomsSqFt = temp_totalBathroomsSqFt;
        //that.totalCommonAreasSqFt = temp_totalCommonAreasSqFt;
        //that.totalExteriorAreasSqFt = temp_totalExteriorAreasSqFt;

        //that.activePropertyBedrooms = temp_activePropertyBedrooms;
        //that.activePropertyBathrooms = temp_activePropertyBathrooms;
        //that.activePropertyInteriorAreas = temp_activePropertyInteriorAreas;
        //that.activePropertyExteriorAreas = temp_activePropertyExteriorAreas;
        this.ngzone.run(() => {
          this.totalBedroomsSqFt = temp_totalBedroomsSqFt;
          this.totalBathroomsSqFt = temp_totalBathroomsSqFt;
          this.totalCommonAreasSqFt = temp_totalCommonAreasSqFt;
          this.totalExteriorAreasSqFt = temp_totalExteriorAreasSqFt;

          this.activePropertyBedrooms = temp_activePropertyBedrooms;
          this.activePropertyBathrooms = temp_activePropertyBathrooms;
          this.activePropertyInteriorAreas = temp_activePropertyInteriorAreas;
          this.activePropertyExteriorAreas = temp_activePropertyExteriorAreas;
        });

      });
    }


    this.dismissSpinner4();
  }

  public toogleViews(type) {
    if (type == 'bedroom') {
      this.bedroomToggle = !this.bedroomToggle;
      this.bathroomToggle = false;
      this.commonAreaToggle = false;
      this.exteriorAreaToogle = false;
    } else if (type == 'bathroom') {
      this.bathroomToggle = !this.bathroomToggle;
      this.bedroomToggle = false;
      this.commonAreaToggle = false;
      this.exteriorAreaToogle = false;
    } else if (type == 'commonArea') {
      this.commonAreaToggle = !this.commonAreaToggle;
      this.bathroomToggle = false;
      this.bedroomToggle = false;
      this.exteriorAreaToogle = false;
    } else if (type == 'exterior') {
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
    this.roomView = 'default';
    this.router.navigate(['profile-items']);
  }

  public editProfileItems(profileName, areaType) {
    this.QueryParams = {
      profileName: profileName,
      areaType: areaType,
      isAddExterior: false,
    };
    this.router.navigate(['edit-profile']);
  }

  public addExterior() {
    this.QueryParams = {
      profileName: 'exterior',
      areaType: 'exterior',
      isAddExterior: true,
    };
    this.router.navigate(['edit-profile']);
  }

  addItem() {
    this.router.navigate(['item-edit']);
  }

  // TODO: add access modifier
  handleSegmentClick(text: string) {
    switch (text) {
      case 'rooms':
        this.CurrentView = 'Room';
        this.manageView = 'rooms';
        break;
      case 'exteriors':
        this.CurrentView = 'Room';
        this.manageView = 'exteriors';
        break;
      case 'items':
        this.showCategories();
        break;
    }
  }

  private showCategories() {
    this.CurrentView = 'Category';
    this.storageService.delete('ProfileItem');
    this.manageView = 'items';
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
        Name: '',
        Items: this.Suite16Categories.map((x: ISuite16CategoryDto) => {
          let icon: string = '';

          if (
            (x.ImageUrl == undefined ||
              x.ImageUrl == null ||
              x.ImageUrl == '') &&
            (x.IconName == undefined || x.IconName == null || x.IconName == '')
          ) {
            icon = this.getIconRandom();
          } else {
            if (
              x.ImageUrl != undefined &&
              x.ImageUrl != null &&
              x.ImageUrl != ''
            ) {
              icon = x.ImageUrl;
            } else {
              if (
                x.IconName != undefined &&
                x.IconName != null &&
                x.IconName != ''
              ) {
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
    // TODO: Temporarily get because when we make changes from Backoffice
    // they aren't refreshed. We will modify the API such that it will tell the
    // client when it needs to refresh a particular local stored value or ALL local storage.

    //if (
    //  this.Suite16Categories == undefined ||
    //  this.Suite16Categories == null ||
    //  this.Suite16Categories.length == 0
    //) {
    await this.suite16CategoryService.getSuite16Categories().then(
      (x: Array<ISuite16CategoryDto>) => {
        this.Suite16Categories = x;
      },
      (err) => {
        this.uxNotifierService.showToast('An error occured getting some resources.', this._constants.ToastColorBad);

        if (
          this.Suite16Categories === undefined ||
          this.Suite16Categories === null ||
          this.Suite16Categories.length === 0
        ) {
          //this.getSuite16Categories();
        }
      }
    );
    //}
  }

  public suite16CategoryClickEventHandler(gridList: IGridList) {
    let suite16Category: ISuite16CategoryDto = new ISuite16CategoryDto();
    suite16Category.Id = gridList.Items[0].Id;
    suite16Category.Name = gridList.Items[0].Name;
    suite16Category.ImageUrl = gridList.Items[0].IconPath;

    this.Suite16Category = suite16Category;

    this.router.navigate(['line-items']);
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

  public async repair() {
    this.router.navigate(['repair-list']);
  }

  //Loader Code
  async presentSpinner(text: string) {
    this.spinnerText = text;
    this.loading1Visible = true;
  }
  async dismissSpinner() {
    this.loading1Visible = false;
    this.spinnerText = '';
  }

  async presentSpinner2(text: string) {
    this.spinnerText2 = text;
    this.loading2Visible = true;
  }
  async dismissSpinner2() {
    this.loading2Visible = false;
    this.spinnerText2 = '';
  }

  async presentSpinner3(text: string) {
    this.spinnerText3 = text;
    this.loading3Visible = true;
  }
  async dismissSpinner3() {
    this.loading3Visible = false;
    this.spinnerText3 = '';
  }

  async presentSpinner4(text: string) {
    this.spinnerText4 = text;
    this.loading4Visible = true;
  }
  async dismissSpinner4() {
    this.loading4Visible = false;
    this.spinnerText4 = '';
  }
}
