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

  constructor(
    public override navController: NavController,
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
    private productService: ProductsService
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, null);
    this._constants = new Constants();

    //this.assetInfo = this.navParams.get("product");
    //this.action = this.navParams.get("action");
  }

  override ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      this.action = params["action"];
    });
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

  public async profileItemPanelNextClick() {
    let selectedProfileID = [];
    for (let p of this.selectedProperties) {
      //Remove non selected profiles.
      var filtered = p.ProfileItems.filter(function (value, index, arr) {
        return value.selected;
      });
      p.ProfileItems = filtered;

      //Array of selected PRofileItemIds
      for (let prof of p.ProfileItems) {
        if (prof.selected) {
          selectedProfileID.push(prof.Id);
        }
      }
    }

    this.loading = await this.loadingCtrl.create({
      message: "",
      cssClass: "my-loading-class",
    });
    this.loading.present();

    await this.propertyService
      .getProfileItemsByIds(selectedProfileID, this.User.Types[0].Name)
      .then((profileItems: any) => {
        console.log("ProfileItems = ", profileItems);

        for (let p of this.selectedProperties) {
          for (let propertyProfileItem of p.ProfileItems) {
            for (let resultProfileItem of profileItems) {
              if (resultProfileItem.Id === propertyProfileItem.Id) {
                propertyProfileItem.LineItems = resultProfileItem.Area.LineItems;
                propertyProfileItem.selected = false;
                for (let lineItem of propertyProfileItem.LineItems) {
                  lineItem.selected = false;
                }
              }
            }
          }
        }

        this.isShowArea = false;
        this.isShowLineItem = true;
        this.loading.dismiss();
      })
      .catch((error) => {
        console.log(error);
        this.loading.dismiss();
      });
  }

  public async propertyPanelNextClick() {
    this.isShowProperty = false;

    let selectedPropertyIDs = [];

    for (let p of this.selectedProperties) {
      selectedPropertyIDs.push(p.Id);
    }

    this.loading = await this.loadingCtrl.create({
      message: "",
      cssClass: "my-loading-class",
    });
    this.loading.present();
    ///Should set this data inside selected properties array
    await this.propertyService
      .getPropertiesById(selectedPropertyIDs)
      .then((properties: any) => {
        console.log("SeletedProperties = ", properties);
        //this.selectedPropertyUserTypeID = property.UserTypeId;
        //this.profileItems = [];
        //for (let Profiles of property.Profiles) {
        //    for (let profileItem of Profiles.ProfileItems) {
        //        this.profileItems.push(profileItem);
        //    }
        //}
        this.selectedProperties = [];
        //this.selectedProperties = properties;

        for (let property of properties) {
          let prop: any = {};
          prop.Id = property.Id;
          prop.Name = property.Name;
          prop.ProfileItems = [];
          for (let Profiles of property.Profiles) {
            for (let profileItem of Profiles.ProfileItems) {
              let item: any = {};
              item.Id = profileItem.Id;
              item.Name = profileItem.Name;
              //item.LineItems =profileItem.Area.LineItems;
              item.selected = false;

              prop.ProfileItems.push(item);
            }
          }
          this.selectedProperties.push(prop);
        }

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

    await this.propertyService
      .getProfileItems(this.selectedProfileItemID, this.User.Types[0].Name)
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

  async onLineItemSelect() {
    this.isShowSave = true;
  }

  async save() {
    this.loading = await this.loadingCtrl.create({
      message: "",
      cssClass: "my-loading-class",
    });
    this.loading.present();
    if (this.action === this._constants.Actions.clone) {
      let clonePropertyList: Array<ClonePropertyDto> = new Array();
      for (let p of this.selectedProperties) {
        let clonePropertyDto: ClonePropertyDto = {
          PropertyId: p.Id,
          IsProxy: false,
          ProfileItems: new Array(),
        };
        for (let profileItem of p.ProfileItems) {
          let cloneProfileItemDto: CloneProfileItemDto = {
            ProfileItemId: profileItem.Id,
            LineItems: new Array(),
          };

          cloneProfileItemDto.ProfileItemId = profileItem.Id;

          for (let lineItem of profileItem.LineItems) {
            if (lineItem.selected) {
              let cloneLineItemDto: CloneLineItemDto = new CloneLineItemDto();
              cloneLineItemDto.LineItemId = lineItem.Id;

              cloneProfileItemDto.LineItems.push(cloneLineItemDto);
            }
          }

          clonePropertyDto.ProfileItems.push(cloneProfileItemDto);
        }

        clonePropertyList.push(clonePropertyDto);
      }

      this.productService.cloneProduct(clonePropertyList, this.ActiveItem.AssetInfo.Id).then(
        (response: Array<AssetIndexDto>) => {
          this.loading.dismiss();
          this.uxNotifierService.showToast("Product was Cloned successfully", this._constants.ToastColorGood);
          this.router.navigate(["item-details"]);
        },
        (error) => {
          this.loading.dismiss();
          this.uxNotifierService.showToast("There was an error cloning this product", this._constants.ToastColorBad);
          //this.router.navigate(['item-details']);
        }
      );
    } else if (this.action === this._constants.Actions.move) {
      this.productService.moveProduct(this.selectedPropertyID, 0, this.selectedProfileItemID, this.selectedLineItemID, this.ActiveItem.AssetInfo.Id).then(
        (response: AssetIndexDto) => {
          this.loading.dismiss();
          this.uxNotifierService.showToast("Product was moved successfully", this._constants.ToastColorGood);
          this.router.navigate(["items"]);
        },
        (error) => {
          this.loading.dismiss();
          this.uxNotifierService.showToast("There was an error moving this product", this._constants.ToastColorBad);
          //this.router.navigate(['item-details']);
        }
      );
    }
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
        for (let profileItem of p.ProfileItems) {
          profileItem.selected = p.selected;
        }
      }
    }
  }

  public onProfileItemSelectAllToggle(propertyIndex, profileItemIndex) {
    for (let [propIndex, p] of this.selectedProperties.entries()) {
      if (propIndex == propertyIndex) {
        for (let [profileIndex, profileItem] of p.ProfileItems.entries()) {
          if (profileIndex == profileItemIndex) {
            for (let lineItem of profileItem.LineItems) {
              lineItem.selected = profileItem.selected;
            }
          }
        }
      }
    }
  }
}
