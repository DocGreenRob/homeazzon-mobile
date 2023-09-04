import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { AlertController, LoadingController, MenuController, ModalController, NavController, Platform } from "@ionic/angular";
import { IProfileItemDto } from "src/app//models/dto/interfaces/IProfileItemDto";
import { Constants } from "src/app/common/Constants";
import { IGrid } from "src/app/models/dto/interfaces/IGrid";
import { IGridList } from "src/app/models/dto/interfaces/IGridList";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { ISuite16CategoryDto } from "src/app/models/dto/interfaces/ISuite16Category";
import { ISuite16CategoryLineitemDto } from "src/app/models/dto/interfaces/ISuite16CategoryLineitemDto";
import { IUserLineitemDto } from "src/app/models/dto/interfaces/IUserLineitemDto";
import { SegmentItem } from "src/app/models/SegmentItem";
import { BasePage } from "src/app/pages/base/base.page";
import { EditCategoriesPage } from "src/app/pages/modals/edit-categories/edit-categories.page";
import { CommunicatorService } from "src/app/services/communicator/communicator.service";
import { FeaturesService } from "src/app/services/features/features.service";
import { LineitemService } from "src/app/services/lineitem/lineitem.service";
import { ProfileItemImageService } from "src/app/services/profile-item-image/profile-item-image.service";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { ProfileItemImageDto } from "../../../../models/dto/ProfileItemImageDto";

@Component({
  selector: "app-profile-items",
  templateUrl: "./profile-items.page.html",
  styleUrls: ["./profile-items.page.scss"],
})
export class ProfileItemsPage extends BasePage {
  userId: any;
  lineitems: Array<ILineitemDto> = [];
  userLineitems: Array<ILineitemDto> = [];
  loading: any;
  image: any;
  detEditing: boolean = false;
  constants: Constants;

  public manageProfileItemsView: any = "digiDoc";
  public data: IGrid;
  public _profileItemName: string;
  public isDigiDocSubscriber: boolean = true;
  public unopenedSuggestionCount: number = 0;
  public isViewLoaded: boolean = false;

  public views: Array<SegmentItem> = [
    {
      name: "My Stuff",
      value: "digiDoc",
    },
    {
      name: "Wishlist",
      value: "wishlist",
    },
    {
      name: "Suggestions",
      value: "suggested",
    },
  ];

  constructor(
    public override navController: NavController,
    private propertyService: PropertyProfilesService,
    private loadingCtrl: LoadingController,
    public override uxNotifierService: UxNotifierService,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public lineItemService: LineitemService,
    private modalCtrl: ModalController,
    public override platform: Platform,
    public override router: Router,
    public override featuresService: FeaturesService,
    public alertCtrl: AlertController,
    public override userTypesService: UserTypesService,
    public profileItemImageService: ProfileItemImageService,
    public editCategoriesPage: EditCategoriesPage,
    public override inAppBrowser: InAppBrowser
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser);
    this.constants = new Constants();
  }

  override async ngOnInit() {}

  ionViewDidEnter() {
    console.log("ionViewDidEnter ProfileItemsPage");
    //this.AppInsights.trackPageView({ name: 'ProfileItemsPage' });

    // temporarily: give all user the 'DigiDoc' subscription
    //if (this.User.Subscriptions) {
    //	this.isDigiDocSubscriber = this.User.Subscriptions.findIndex(x => x.Name === 'DigiDoc') !== -1;
    //}
    //else {
    //	this.isDigiDocSubscriber = false;
    //}

    this.LineItem = {} as ILineitemDto;
    this.start();
  }

  async start() {
    if (this.User.IsPrivateLabelPartner) {
      this.manageProfileItemsView = "suggested";
      this.views = [
        {
          name: "",
          value: "dummy_a",
        },
        {
          name: "",
          value: "dummy_b",
        },
        {
          name: "Suggestions",
          value: "suggested",
        },
      ];
    }

    await this.getProfileItemLineItems(this.User.Types[0].Name);
  }

  uniqueSuite16Categories(value, index, self) {
    let answer = self.indexOf((x) => x.Suite16Categories[0].Id == value.Suite16Categories[0].Id);
    return answer;
  }

  handleSegmentChanged(event: string) {
    this.manageProfileItemsView = event;
  }

  // duplicated in item-edit
  async getProfileItemLineItems(userType: string) {
    this.lineitems = new Array<ILineitemDto>();

    this.loading = await this.loadingCtrl.create({
      message: "Getting lineitems...",
      cssClass: "my-loading-class",
    });
    this.loading.present();

    //let a: Array<LineitemDto> = this.ProfileItemLineItems;
    // 12.19.19...rag...this will change to get => /api/profileItem/{profileItemId}/lineitems?userType={userTypeId}
    await this.propertyService
      .getProfileItems(this.ProfileItem.Id, userType)
      .then(
        async (response: any) => {
          let profileItem: IProfileItemDto = this.ProfileItem;
          profileItem.ItemCount = response.ItemCount;
          this.ProfileItem = profileItem;

          this.data = {
            Lists: [],
          };

          this.unopenedSuggestionCount = response.UnopenedSuggestionCount;

          // when user adds a custom area w/o lineitems...
          if (response.Area.LineItems.length === 0) {
            this.ProfileItemLineItems = [];

            this.lineItemService.getLineitems().then(
              async (x: any) => {
                ////Commented by Rupesh for test on 04082020. Should uncommment later
                ////let lotDetailsModal = await this.modalCtrl.create(ListModalPage, { lineitems: x })
                ////lotDetailsModal.present();
              },
              (err) => {}
            );
          } else {
            response.Area.LineItems.forEach((x) => {
              this.lineitems.push(x);
            });

            let originalLineitems: Array<ILineitemDto> = this.lineitems;
            this.Lineitems = this.lineitems;
            this.DigiDocLineitems = this.Lineitems.filter((x) => x.IsForDigiDoc);

            await this.propertyService
              .getUserProfileItemLineitems(this.ProfileItem.Id)
              .then(
                (userProfileItemLineitems: Array<IUserLineitemDto>) => {
                  let userProfileItemLineitemDtos: Array<IUserLineitemDto> = userProfileItemLineitems;
                  // IsForDesign
                  // 1.
                  let step1a: Array<ILineitemDto> = this.lineitems.filter((x) => x.IsForDesign && x.IsRequired);
                  // 2.
                  let step2a: Array<ILineitemDto> = this.lineitems.filter((x) => x.IsForDesign && x.IsOptional);
                  userProfileItemLineitemDtos.forEach((x) => {
                    if (!x.IsDisplay) {
                      let idx: number = step2a.findIndex((a) => a.Id === x.LineitemId);
                      if (idx !== -1) {
                        step2a.splice(idx, 1);
                      }
                    }
                  });

                  let tempLineitems: Array<ILineitemDto> = new Array<ILineitemDto>();
                  tempLineitems = step1a;
                  step2a.forEach((x) => {
                    tempLineitems.push(x);
                  });

                  // 3.
                  let step3a: Array<ILineitemDto> = this.lineitems.filter((x) => x.IsForDesign && x.IsOptional);
                  step3a.forEach((x) => {
                    let idx: number = userProfileItemLineitemDtos.findIndex((a) => a.LineitemId === x.Id);
                    if (idx === -1) {
                      // is in tempDigiDocLineitems
                      let lineitemIdx: number = tempLineitems.findIndex((a) => a.Id === x.Id);
                      if (lineitemIdx !== -1) {
                        tempLineitems[lineitemIdx].IsDoRequireUserAction = true;
                      } else {
                        x.IsDoRequireUserAction = true;
                        tempLineitems.push(x);
                      }
                    }
                  });

                  // sort the list
                  //tempLineitems.sort(this.compareLineitems);
                  //this.Lineitems = tempLineitems;
                  //this.lineitems = this.Lineitems;

                  // ---------------------------------|
                  //------------- DigiDoc ------------|
                  // ---------------------------------|
                  if (this.isDigiDocSubscriber) {
                    // IsForDigiDoc
                    // 1.
                    let step1b: Array<ILineitemDto> = originalLineitems.filter((x) => x.IsForDigiDoc && x.IsRequired);
                    // 2.
                    let step2b: Array<ILineitemDto> = originalLineitems.filter(
                      (x) => (x.IsForDigiDoc && x.IsOptional) || (x.IsForDigiDoc && !x.IsOptional && !x.IsRequired)
                    );
                    userProfileItemLineitemDtos.forEach((x) => {
                      if (!x.IsDisplay) {
                        let idx: number = step2b.findIndex((a) => a.Id === x.LineitemId);
                        if (idx !== -1) {
                          step2b.splice(idx, 1);
                        }
                      }
                    });

                    let tempDigiDocLineitems: Array<ILineitemDto> = new Array<ILineitemDto>();
                    tempDigiDocLineitems = step1b;
                    step2b.forEach((x) => {
                      tempDigiDocLineitems.push(x);
                    });

                    // 3.
                    let step3b: Array<ILineitemDto> = originalLineitems.filter((x) => x.IsForDigiDoc && x.IsOptional);
                    step3b.forEach((x) => {
                      let idx: number = userProfileItemLineitemDtos.findIndex((a) => a.LineitemId === x.Id);
                      if (idx === -1) {
                        // is in tempDigiDocLineitems
                        let digiDocLineitemIdx: number = tempDigiDocLineitems.findIndex((a) => a.Id === x.Id);
                        if (digiDocLineitemIdx !== -1) {
                          tempDigiDocLineitems[digiDocLineitemIdx].IsDoRequireUserAction = true;
                        } else {
                          x.IsDoRequireUserAction = true;
                          tempDigiDocLineitems.push(x);
                        }
                      }
                    });

                    // sort the list
                    let _tempLineitems: Array<ILineitemDto> = [];
                    tempDigiDocLineitems.sort(this.compareLineitems);

                    tempDigiDocLineitems.forEach((x) => {
                      _tempLineitems.push(x);
                    });

                    let tempLineitemsToDisplay = this.Lineitems;
                    tempLineitemsToDisplay.forEach((x) => {
                      _tempLineitems.push(x);
                    });
                    _tempLineitems.sort(this.compareLineitems);

                    this.Lineitems = _tempLineitems;
                    // ensure there are no duplicates
                    let tempLineitems: Array<ILineitemDto> = new Array<ILineitemDto>();
                    this.Lineitems.forEach((x) => {
                      let a: any = tempLineitems.filter((b) => b.Id == x.Id);

                      if (a.length == 0) {
                        tempLineitems.push(x);
                      }
                    });
                    //this.lineitems = tempLineitems;
                    //this.Lineitems = tempLineitems;

                    console.log("lineitems", this.Lineitems);
                  }

                  if (this.Lineitems.length == 0) {
                    this.manageProfileItemsView = "digiDoc";
                  }

                  // Optional Lineitems Setup
                  let groups: Array<ISuite16CategoryLineitemDto> = new Array<ISuite16CategoryLineitemDto>();
                  let optionalLineitems: Array<ILineitemDto> = response.Area.LineItems.filter((x) => x.IsOptional);
                  let lineitemsWithoutSuite16Category: Array<ILineitemDto> = new Array<ILineitemDto>();

                  optionalLineitems.forEach((x: ILineitemDto) => {
                    if (x.Suite16Categories == undefined || x.Suite16Categories == null || x.Suite16Categories.length == 0) {
                      lineitemsWithoutSuite16Category.push(x);
                    } else {
                      x.IsChecked = false;
                      let temp1 = userProfileItemLineitems.filter((i) => i.LineitemId == x.Id);
                      if (temp1 != undefined && temp1 != null && temp1.length > 0) {
                        x.IsChecked = temp1[0].IsDisplay;
                      }

                      x.Suite16Categories.forEach((y: ISuite16CategoryDto) => {
                        let g = groups.filter((a) => a.Id == y.Id);

                        if (g != undefined && g != null && g.length > 0) {
                          if (groups.length == 0) {
                            let suite16CategoryLineitemDto: ISuite16CategoryLineitemDto = {} as ISuite16CategoryLineitemDto;
                            suite16CategoryLineitemDto.Id = y.Id;
                            suite16CategoryLineitemDto.Name = y.Name;
                            suite16CategoryLineitemDto.Lineitems = [];
                            suite16CategoryLineitemDto.Lineitems.push(x);
                            groups.push(suite16CategoryLineitemDto);
                          } else {
                            // find & update
                            let temp = groups.filter((a) => a.Id == y.Id);
                            if (temp != undefined && temp != null && temp.length > 0) {
                              groups.filter((a) => a.Id == y.Id)[0].Lineitems.push(x);
                            }
                          }
                        } else {
                          let suite16CategoryLineitemDto: ISuite16CategoryLineitemDto = {} as ISuite16CategoryLineitemDto;
                          suite16CategoryLineitemDto.Id = y.Id;
                          suite16CategoryLineitemDto.Name = y.Name;
                          suite16CategoryLineitemDto.Lineitems = [];
                          suite16CategoryLineitemDto.Lineitems.push(x);
                          groups.push(suite16CategoryLineitemDto);
                        }
                      });
                    }
                  });

                  console.log("lineitemsWithoutSuite16Category", lineitemsWithoutSuite16Category);
                  this.Suite16CategoryLineitems = groups;

                  this.isViewLoaded = true;
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

          this.loading.dismiss();
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

  public lineitemClickEventHandler(gridList: IGridList) {
    let lineItem = this.LineItem;
    lineItem.Id = gridList.Items[0].Id;
    lineItem.Name = gridList.Items[0].Name;

    this.LineItem = lineItem;
    this.router.navigate(["items"]);
  }

  public getItems(lineitem: ILineitemDto) {
    //if (!this.isDigiDocSubscriber) {
    //	if (lineitem.IsForDigiDoc) {
    //		this.uxNotifierService.presentSimpleAlert('You need to upgrade to use this feature!', 'Upgrade Required');
    //		return;
    //	}
    //}

    this.LineItem = lineitem;
    this.router.navigate(["items"]);
  }

  public toggle(lineitemDto: ILineitemDto, event: any) {
    console.log("event", event);
  }

  public close() {
    this.router.navigate(["dashboard"]);
  }

  public async subscribeToDigiDocFeature() {
    (
      await this.alertCtrl.create({
        header: "Confirm Upgrade",
        message: `Click "OK" to upgrade to use the DigiDoc feature? For now it is free, but will soon be $9.99 per month.`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              return;
            },
          },
          {
            text: "Ok",
            cssClass: "signout",
            handler: () => {
              this.upgradeSubscription(this.Features.filter((x) => x.Name === "DigiDoc")[0].Id).then((x) => {
                if (x) {
                  this.isDigiDocSubscriber = true;
                  this.manageProfileItemsView = "wishlist";
                  this.start();
                }
              });
            },
          },
        ],
      })
    ).present();
    return;
  }

  public async clickOptionalItems() {
    let addRoomModal = null;

    await this.modalCtrl.create({ component: EditCategoriesPage }).then((modal) => {
      modal.present();
      addRoomModal = modal;
    });

    addRoomModal.dismiss().then((x) => {
      if (x) {
        this.start();
      }
    });
  }

  public seeProfileItemItems() {
    this.profileItemImageService.getProfileItemImagesAsync(this.ProfileItem.Id).then(
      (x: Array<ProfileItemImageDto>) => {
        this.ProfileItemImages = x;
        this.router.navigate(["items"]);
      },
      (err) => {}
    );
  }

  addLineItems() {
    this.router.navigate(["add-line-item"]);
  }
}
