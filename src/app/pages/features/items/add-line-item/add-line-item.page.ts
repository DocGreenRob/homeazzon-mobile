import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { UserLineitemsDto } from "./../../../../models/dto/interfaces/UserLineItemsDto";
import { IProfileItemDto } from "./../../../../models/dto/interfaces/IProfileItemDto";
import { Constants } from "src/app/common/Constants";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { EditCategoriesPage } from "./../../../modals/edit-categories/edit-categories.page";
import { ProfileItemImageService } from "./../../../../services/profile-item-image/profile-item-image.service";
import { UserTypesService } from "./../../../../services/user-types/user-types.service";
import { FeaturesService } from "./../../../../services/features/features.service";
import { LineitemService } from "./../../../../services/lineitem/lineitem.service";
import { CommunicatorService } from "./../../../../services/communicator/communicator.service";
import { UxNotifierService } from "./../../../../services/uxNotifier/ux-notifier.service";
import { PropertyProfilesService } from "./../../../../services/property-profile/property-profiles.service";
import { NavController, LoadingController, MenuController, ModalController, Platform, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { BasePage } from "src/app/pages/base/base.page";
import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-add-line-item",
  templateUrl: "./add-line-item.page.html",
  styleUrls: ["./add-line-item.page.scss"],
})
export class AddLineItemPage extends BasePage {
  constants = new Constants();
  existingLineItems: Array<ILineitemDto> = new Array();
  allLineItems: Array<ILineitemDto> = new Array();
  lineItemTypeId: number;
  lineItemName: string;
  @ViewChild("content") private content: any;
  profileItem: IProfileItemDto = {} as IProfileItemDto;
  uiType: string;

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

  override ngOnInit() {}

  ionViewDidEnter() {
    this.existingLineItems = this.Lineitems;
    this.profileItem = this.ProfileItem;

    this.getAllLineItems();
  }

  close() {
    this.router.navigate(["profile-items"]);
  }

  scrollToBottom() {
    this.content.scrollToBottom(300);
  }

  getAllLineItems() {
    this.lineItemService.getLineitems().then(
      (lineItems: Array<ILineitemDto>) => {
        this.allLineItems = lineItems;
        this.matchLineItems();
      },
      (error) => {}
    );
  }

  matchLineItems() {
    let addedIds = new Array<number>();
    this.allLineItems = this.allLineItems.map((x) => {
      let item = this.existingLineItems.filter((k) => k.Id == x.Id);

      if (item.length) {
        addedIds.push(x.Id);
        x = item[0];
        x.IsUserDefined = false;
        x.IsChecked = true;
      } else {
        x.IsUserDefined = false;
        x.IsChecked = false;
      }

      return x;
    });
    ///get custom user line items
    for (let i of this.existingLineItems) {
      let count = addedIds.filter((x) => x == i.Id);
      if (count.length > 0) {
      } else {
        let item = {} as ILineitemDto;
        item = i;
        item.IsChecked = true;
        item.IsUserDefined = true;
        this.allLineItems.push(item);
      }
    }

    this.allLineItems = this.allLineItems.sort(this.sortByBoolean);
  }

  async editLineItem(lineitem: ILineitemDto) {
    const alert = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      header: "Edit LineItem",
      inputs: [
        {
          name: "lineItemName",
          type: "text",
          label: " LineItem Name",
          value: lineitem.Name,
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Save Changes",
          handler: (data) => {
            if (data.lineItemName) {
              lineitem.Name = data.lineItemName;
              console.log(lineitem);
              this.lineItemService.updateUserDefinedLineitem(lineitem).then(
                () => {
                  this.uxNotifierService.showToast("Line Item updated successfully", this.constants.ToastColorGood);
                },
                (error) => {
                  this.uxNotifierService.showToast("Error updating Line item, Try again later.", this.constants.ToastColorBad);
                }
              );
              return true;
            } else {
              this.uxNotifierService.showToast("Enter  lineitem name to continue", this.constants.ToastColorBad);
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteLineItem(lineitem: ILineitemDto) {
    const alert = await this.alertCtrl.create({
      cssClass: `my-custom-class`,
      header: `Confirm Removing ${lineitem.Name}`,
      message: `Are you sure you want to delete ${lineitem.Name}?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Yes",
          handler: (data) => {
            this.lineItemService.deleteUserDefinedLineitem(lineitem.Id).then(
              (response) => {
                let index = this.allLineItems.indexOf(lineitem);
                this.allLineItems.splice(index, 1);
                this.uxNotifierService.showToast("Lineitem was deleted successfully", this.constants.ToastColorGood);
              },
              (error) => {
                this.uxNotifierService.showToast("Error removing lineitem", this.constants.ToastColorBad);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  sortByBoolean = (x, y) => {
    return x.IsChecked === y.IsChecked ? 0 : x ? -1 : 1;
  };

  async addLineItem() {
    const alert = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      header: "Add New LineItem",
      inputs: [
        {
          name: "lineItemName",
          type: "text",
          label: "New LineItem Name",
          value: "",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Add",
          handler: (data) => {
            if (data.lineItemName) {
              this.postNewLineItem(data.lineItemName);
              return true;
            } else {
              this.uxNotifierService.showToast("Enter  lineitem name to continue", this.constants.ToastColorBad);
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  postNewLineItem(lineItemName: string) {
    let lineItem = {} as ILineitemDto;
    lineItem.Name = lineItemName;
    lineItem.IsChecked = true;
    lineItem.Id = 0;
    this.allLineItems.push(lineItem);

    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  saveLineItems() {
    let LineitemIds: Array<number> = new Array();
    let newLineitemNames: Array<string> = new Array();

    for (let x of this.allLineItems) {
      let itemExists: boolean = false;
      let item = this.existingLineItems.filter((k) => k.Id == x.Id);

      if (item.length > 0) {
        itemExists = true;
      }
      if (x.IsChecked && !itemExists && x.Id != 0) {
        LineitemIds.push(x.Id);
      }

      if (x.IsChecked && !itemExists && x.Id == 0) {
        newLineitemNames.push(x.Name);
      }
    }

    let userLineItems = new UserLineitemsDto();
    userLineItems.LineitemIds = LineitemIds;
    userLineItems.NewLineitemNames = newLineitemNames;
    userLineItems.ProfileItemId = this.profileItem.Id;

    if (userLineItems.LineitemIds.length > 0 || userLineItems.NewLineitemNames.length > 0) {
      this.lineItemService.saveUserDefinedLineItems(userLineItems).then(
        (x) => {
          this.uxNotifierService.showToast("Line Items Saved successfully", this.constants.ToastColorGood);
          this.router.navigate(["profile-items"]);
        },
        (error) => {
          this.uxNotifierService.showToast("Error saving Line Items", this.constants.ToastColorBad);
        }
      );
    } else {
      this.router.navigate(["profile-items"]);
    }

    //make api call here
  }
}
