import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { LoadingController, MenuController, ModalController, NavController, NavParams, Platform } from "@ionic/angular";
import { Constants } from "../../../../common/Constants";
import { BasePage } from "../../../base/base.page";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { CommunicatorService } from "../../../../services/communicator/communicator.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { PropertyProfilesService } from "../../../../services/property-profile/property-profiles.service";
import { ProductsService } from "../../../../services/products/products.service";
import { AssetIndexDto } from "../../../../models/dto/interfaces/AssetIndexDto";
import { CloneLineItemDto, CloneProfileItemDto, ClonePropertyDto } from "../../../../models/dto/PropertyCloneDto";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-item-move-clone",
  templateUrl: "./item-move-clone.page.html",
  styleUrls: ["./item-move-clone.page.scss"],
})
export class ItemMoveClonePage extends BasePage {
  public _constants: Constants;
  public properties: any;
  public profileItems: any = [];
  public lineItems: any;
  public isShowProperty: boolean = false;
  public isShowArea: boolean = false;
  public isShowLineItem: boolean = false;
  public isShowSave = false;
  public isHideSegments: boolean = false;
  public selectedProperties: any = [];
  public selectedPropertyID: number;
  public selectedProfileItemID: any;
  public selectedPropertyUserTypeID: any;
  public selectedLineItem: any;
  public selectedLineItemID: any;
  public loading: any;
  public userID: any;
  public buttonText: string = "";
  public actionText: string = "";
  public assetInfo: any;
  public action: any;
  public profileItemsLog: any;
  public isIos: boolean = false;
  private _selectedProfileItemsFromUI: any = [];

  constructor(public override navController: NavController,
    private propertyService: PropertyProfilesService,
    private loadingCtrl: LoadingController,
    public override uxNotifierService: UxNotifierService,
    private sanitizerService: DomSanitizer,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    public override userTypesService: UserTypesService,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private productService: ProductsService,
    public override storageService: LocalStorageService) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, null, null, storageService);
    this._constants = new Constants();

    //this.assetInfo = this.navParams.get("product");
    //this.action = this.navParams.get("action");
    this.isIos = this.platform.is('ios');
  }

  override ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      this.action = params["action"];
    });

    // this.propertyService.getProfileItems(selectedProfileID, userType)
    // .then((profileItems: any) => {
    //   this.profileItems = profileItems;
    //   // Rest of your existing code to manipulate the data
    // });

  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter ItemMoveClonePage");
    this.properties = this.Properties;
    for (let p of this.properties) {
      p.selected = false;
    }
    switch (this.action) {
      case this._constants.Actions.clone:
        this.buttonText = "Clone";
        this.actionText = "Clone";
        break;
      case this._constants.Actions.move:
        this.buttonText = "Move";
        this.actionText = "Move";
        break;
    }
    this.isShowProperty = true;
    this.isShowArea = false;
    this.isShowLineItem = false;
    this.isShowSave = false;
    this.isHideSegments = false;

    this.userID = this.User.Id;
    this.selectedProperties = [];
    this.profileItems = [];
  }

  async onPropertySelect() {
    if (this.action === this._constants.Actions.clone) {
      this.selectedProperties = this.properties.filter((value, index) => {
        return value.selected;
      });
    } else if (this.action === this._constants.Actions.move) {
      this.loading = await this.loadingCtrl.create({
        message: "",
        cssClass: "my-loading-class",
      });
      this.loading.present();

      ///Should set this data inside selected properties array
      await this.propertyService
        .getPropertyById(this.selectedPropertyID)
        .then((property: any) => {
          console.log("getPropertyById = ", property);
          this.selectedPropertyUserTypeID = property.UserTypeId;
          this.profileItems = [];
          for (let Profiles of property.Profiles) {
            for (let profileItem of Profiles.ProfileItems) {
              this.profileItems.push(profileItem);
            }
          }
          this.loading.dismiss();
          this.isShowArea = true;
        })
        .catch((error) => {
          console.log(error);
          this.loading.dismiss();
        });

      this.loading.dismiss();
    }
  }

  getUserShortName(userType: string) {
    var imageName: string = '';

    if (userType.toLowerCase().indexOf('tradesman') > -1) {
      imageName = 'tradesman';
    }
    if (userType.toLowerCase().indexOf('owner') > -1) {
      imageName = 'owner';
    }
    if (userType.toLowerCase().indexOf('developer') > -1) {
      imageName = 'developer';
    }
    if (userType.toLowerCase().indexOf('appraiser') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('architect') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('bank') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('realtor') > -1) {
      imageName = 'realtor';
    }
    if (userType.toLowerCase().indexOf('vendor') > -1) {
      imageName = 'vendor';
    }

    return imageName;
  }

  public async profileItemPanelNextClick() {
    this._selectedProfileItemsFromUI = [];
    const selectedProfiles = [];

    for (let p of this.selectedProperties) {
      //Remove non selected profiles.
      var filtered = p.Profiles.filter(function (value, index, arr) {
        return value.selected;
      });
      p.Profiles = filtered;

      //Array of selected ProfileItemIds
      for (let prof of p.Profiles) {
        if (prof.selected) {
          selectedProfiles.push({ Id: prof.Id, propertyName: p.Name, profileName: prof.ProfileItems[0].Name });
        }
      }
    }

    const userType = this.getUserShortName(this.User.Types[0].Name);
    const loaders = {};

    for(let profile of selectedProfiles) {    
      loaders[profile.Id] = await this.loadingCtrl.create({
        message: `Loading Line Items of ${profile.propertyName} for ${profile.profileName}...`,
        cssClass: "my-loading-class",
      });

      loaders[profile.Id]?.present();

      await this.propertyService.getProfileItems(profile.Id, userType)
        .then((profileItem: any) => {
            loaders[profileItem.Id]?.dismiss();
            this._selectedProfileItemsFromUI.push(profileItem);
            console.log("_selectedProfileItemsFromUI = ", this._selectedProfileItemsFromUI);
            console.log("ProfileItems = ", profileItem);
            console.log("selectedProperties = ", this.selectedProperties);

            for (let p of this.selectedProperties) {
              for (let propertyProfileItem of p.Profiles) {
                if (profileItem.Id === propertyProfileItem.Id) {
                  propertyProfileItem.LineItems = profileItem.Area.LineItems;
                  propertyProfileItem.selected = false;
                  for (let lineItem of propertyProfileItem.LineItems) {
                    lineItem.selected = false;
                  }
                }
              }
            }

            this.isShowArea = false;
            this.isShowLineItem = true;
          })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  public async propertyPanelNextClick() {
    this.isShowProperty = false;

    let selectedPropertyIDs = [];

    for (let p of this.selectedProperties) {
      selectedPropertyIDs.push(p.Id);
    }

    this.loading = await this.loadingCtrl.create({
      message: "Getting property profiles...",
      cssClass: "my-loading-class",
    });
    this.loading.present();

    ///Should set this data inside selected properties array
    await this.propertyService
      .getPropertiesById(selectedPropertyIDs)
      .then((properties: any) => {
        console.log("SeletedProperties = ", properties);

        for (let property of properties) {
          this.selectedPropertyUserTypeID = property.UserTypeId;
          this.profileItems = [];

          for (let Profiles of property.Profiles) {
            for (let profileItem of Profiles.ProfileItems) {
              this.profileItems.push(profileItem);
            }
          }
        }

        this.selectedProperties = [];
        this.selectedProperties = properties;

        this.loading.dismiss();
        this.isShowArea = true;
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
      });
  }

  async onAreaSelect() {
    this.loading = await this.loadingCtrl.create({
      message: "",
      cssClass: "my-loading-class",
    });
    this.loading.present();
    const userType = this.getUserShortName(this.User.Types[0].Name);
    await this.propertyService
      .getProfileItems(this.selectedProfileItemID, userType)
      .then((response: any) => {
        console.log("getProfileItems", response);
        this.isShowLineItem = true;
        this.lineItems = response.Area.LineItems;
        this.loading.dismiss();
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
      });
  }

  public async onLineItemSelect() {
    this.isShowSave = true;
  }

  public async save() {

    this.loading = await this.loadingCtrl.create({
      message: `${this.action} in progress...`,
      cssClass: "my-loading-class",
    });

    this.loading.present();

    let a = this.ActiveItem;
    let googleLink = a.GoogleLink;
    let isGoogleLink = false;

    if (googleLink !== null && googleLink !== undefined) {
      isGoogleLink = true;
    }

    if (this.action === this._constants.Actions.clone) {
      let clonePropertyList: Array<ClonePropertyDto> = new Array();
      for (let p of this.selectedProperties) {
        let clonePropertyDto: ClonePropertyDto = {
          PropertyId: p.Id,
          IsProxy: false,
          ProfileItems: new Array(),
        };
        for (let profile of p.Profiles) {
          const profileItemId = profile.ProfileItems[0].Id;

          let cloneProfileItemDto: CloneProfileItemDto = {
            ProfileItemId: profileItemId,
            LineItems: new Array(),
          };

          cloneProfileItemDto.ProfileItemId = profileItemId;

          this._selectedProfileItemsFromUI.forEach((profileItem) => {
            if (profileItem.Id === profileItemId) {
              for (let lineItem of profileItem.Area.LineItems) {
                if (lineItem.selected) {
                  let cloneLineItemDto: CloneLineItemDto = new CloneLineItemDto();
                  cloneLineItemDto.LineItemId = lineItem.Id;

                  cloneProfileItemDto.LineItems.push(cloneLineItemDto);
                }
              }
            }
          });

          clonePropertyDto.ProfileItems.push(cloneProfileItemDto);
        }

        clonePropertyList.push(clonePropertyDto);
      }

      if (isGoogleLink) {
        this.productService.cloneGoogleLink(clonePropertyList, this.ActiveItem.GoogleLink.Id).then((x) => this.handleCloneResponseSuccess(x, this.loading), (x) => this.handleCloneResponseError(x, this.loading));
      } else {
        this.productService.cloneProduct(clonePropertyList, this.ActiveItem.AssetInfo.Id).then((x) => this.handleCloneResponseSuccess(x, this.loading), (x) => this.handleCloneResponseError(x, this.loading));
      }

    } else if (this.action === this._constants.Actions.move) {
      if (isGoogleLink) {
        this.productService.moveGoogleLink(this.selectedPropertyID,
          0,
          this.selectedProfileItemID,
          this.selectedLineItemID,
          this.ActiveItem.GoogleLink.Id).then((x) => this.handleMoveResponseSuccess(x, this.loading), (x) => this.handleMoveResponseError(x, this.loading));
      } else {
        this.productService.moveProduct(this.selectedPropertyID,
          0,
          this.selectedProfileItemID,
          this.selectedLineItemID,
          this.ActiveItem.AssetInfo.Id).then((x) => this.handleMoveResponseSuccess(x, this.loading), (x) => this.handleMoveResponseError(x, this.loading));
      }

    }
  }

  private handleCloneResponseSuccess(response: Array<AssetIndexDto>, loading: any) {
    loading.dismiss();
    this.uxNotifierService.showToast("Product was Cloned successfully", this._constants.ToastColorGood);
    this.router.navigate(["item-details"]);
  }

  private handleCloneResponseError(error: any, loading: any) {
    this.loading.dismiss();
    this.uxNotifierService.showToast("There was an error cloning this product", this._constants.ToastColorBad);
    setTimeout(() => {
      this.router.navigate(['item-details']);
    }, 2000);
  }

  private handleMoveResponseSuccess(response: Array<AssetIndexDto>, loading: any) {
    this.loading.dismiss();
    this.uxNotifierService.showToast("Product was moved successfully", this._constants.ToastColorGood);
    this.router.navigate(["items"]);
  }

  private handleMoveResponseError(error: any, loading: any) {
    this.loading.dismiss();
    this.uxNotifierService.showToast("There was an error moving this product", this._constants.ToastColorBad);
    setTimeout(() => {
      this.router.navigate(['items']);
    }, 2000);
  }

  public close() {
    this.router.navigate(["item-details"]);
  }

  public onSelectAllToggle(e) {
    for (let [propIndex, p] of this.properties.entries()) {
      p.selected = e.target.checked;
    }
  }

  public onPropertySelectAllToggle(index) {
    for (let [propIndex, p] of this.selectedProperties.entries()) {
      if (propIndex == index) {
        for (let profileItem of p.Profiles) {
          profileItem.selected = p.selected;
        }
      }
    }
  }
  public selectedProfileItemLineitems: any = [];

  public onProfileItemSelectAllToggle(propertyIndex, profileItemIndex) {
    this.selectedProfileItemLineitems = [];
    for (let [propIndex, p] of this.selectedProperties.entries()) {
      if (propIndex == propertyIndex) {
        for (let [profileIndex, profile] of p.Profiles.entries()) {
          if (profileIndex == profileItemIndex) {
            this._selectedProfileItemsFromUI.forEach((profileItem) => {
              if (profileItem.Id === profile.ProfileItems[0].Id) {
                let a = this.selectedProperties;
                let b: any = [];

                for (let x of a) {
                  if (x.Id === p.Id) {
                    let z: any = x.Profiles[profileIndex];
                    // add a new property to the object
                    z.LineItems = [];
                    z.LineItems = profileItem.Area.LineItems;
                    x.Profiles[profileIndex] = z;
                    b.push(x);
                  } else {
                    b.push(x);
                  }
                }

                this.selectedProperties = b;
                console.log("selectedProperties = ", this.selectedProperties);
              }
            });

            for (let lineItem of profile.LineItems) {
              if(!profile.selected) {
                lineItem.selected = false;
              }
            }
          }
        }
      }
    }
  }

  private getProfileItemLineitems(profileItemID: number): any {
    this._selectedProfileItemsFromUI.forEach((profileItem) => {
      if (profileItem.Id === profileItemID) {
        return profileItem.Area.LineItems;
      }
    });
  }

}
