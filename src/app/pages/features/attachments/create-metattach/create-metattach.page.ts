import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IMetattachDto } from "src/app/models/dto/interfaces/IMetattachDto";
import { BasePage } from "src/app/pages/base/base.page";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { IMetattachTypeDto } from "../../../../models/dto/interfaces/IMetattachTypeDto";
import { MetattachService } from "../../../../services/metattach/metattach.service";
import { ActiveItem } from "./../../../../models/ActiveItem";

@Component({
  selector: "app-create-metattach",
  templateUrl: "./create-metattach.page.html",
  styleUrls: ["./create-metattach.page.scss"],
})
export class CreateMetattachPage extends BasePage {
  private _loading: any;
  private _constants: Constants;

  public metattachTypes: Array<IMetattachTypeDto> = [];
  public TempActiveItem: ActiveItem = null;
  public metattachTypeId: number = 0;
  public title: string = "";
  public notes: string = "";
  public image: string = "";
  public isDisabled: boolean = false;

  constructor(
    public navCtrl: NavController,
    private metattachService: MetattachService,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    private loadingCtrl: LoadingController,
    public override platform: Platform,
    public alertCtrl: AlertController
  ) {
    super(navCtrl, null, null, null, platform, router, uxNotifierService, null, null);
    this._constants = new Constants();
    this.TempActiveItem = this.ActiveItem;
  }

  override ngOnInit() {
    console.log("ngOnInit CreateMetattachPage");
    //this.AppInsights.trackPageView({ name: 'CreateMetattachPage' });
    console.log(this.ActiveAttachmentItem);
    this.start();
    this.setImage();
  }

  public setImage() {
    if (this.IsMetattachment) {
      if (this.ActiveAttachmentItem.Type === "DigiDoc") {
        this.image = this.ActiveAttachmentItem.Image;
      }

      this.title = this.ActiveAttachmentItem.AssetInfo.Title;

      if (this.ActiveAttachmentItem.AssetInfo.TypeId) {
        this.metattachTypeId = this.ActiveAttachmentItem.AssetInfo.TypeId;
      }
      if (this.ActiveAttachmentItem.AssetInfo.Notes) {
        this.notes = this.ActiveAttachmentItem.AssetInfo.Notes;
      }

      // edit permissions
      if (this.ActiveItem.IsSuggest && !this.User.IsPrivateLabelPartner) {
        this.isDisabled = true;
      }
    } else {
      // Google Shopping / Amazon
      if (this.LastSavedItem.ProductDetails != undefined) {
        this.image = this.LastSavedItem.ProductDetails.Image;
      }

      // Google Web
      if (this.LastSavedItem.GoogleTextDetails != undefined) {
        this.image =
          "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Fglobe.svg?alt=media&token=aac6d1a7-8dd1-4b35-bac1-b0961b6e50fc";
      }

      // Qr Code
      if (this.LastSavedItem.Type == "Qr Code") {
        this.image =
          "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Fqrcode.svg?alt=media&token=80c296d2-280c-4c42-aa19-50b0027fe89a";
      }

      // YouTube
      if (this.LastSavedItem.YouTubeDetails != undefined) {
        this.image = this.LastSavedItem.YouTubeDetails.ThumbnailImg;
      }

      // DigiDoc
      if (this.LastSavedItem.Type == "DigiDoc") {
        // inspect the content type
        if (this.LastSavedItem.ContentType.indexOf("png") != -1) {
          this.image = this.LastSavedItem.Url;
        } else {
          this.image =
            "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-alt.svg?alt=media&token=5fc4313c-3c89-45e0-b447-f9fd9500afa6";
        }
      }

      // Upc
      if (this.LastSavedItem.Type == "Upc") {
        this.image = this.LastSavedItem.AssetInfo.Image;
      }
    }
  }

  /* beta */
  public async start() {
    // 1. get metattach lineitem types
    await this.metattachService.getMetattachTypeByLineItemId(this.LineItem.Id).then(
      (x: Array<IMetattachTypeDto>) => {
        this.metattachTypes = x;
        console.log(this.metattachTypes);
      },
      (err) => {}
    );
  }

  public async save() {
    if (this.title == "") {
      const alert = this.alertCtrl.create({
        subHeader: "Error",
        message: "Please enter the title.",
        buttons: ["Ok"],
      });
      await (await alert).present();
      return;
    }
    if (this.notes == "") {
      this.notes = " - ";
    }
    this._loading = await this.loadingCtrl.create({
      message: "saving...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();

    let metattachData: IMetattachDto = {} as IMetattachDto;
    if (this.ActiveAttachmentItem.Id !== undefined) {
      metattachData.Id = this.ActiveAttachmentItem.Id;
    }
    metattachData.AttachmentTypeId = this.metattachTypeId;
    metattachData.Name = this.title;
    metattachData.Notes = this.notes;

    if (this.ActiveItem.Type === "DigiDoc") {
      metattachData.ParentAssetInfoId = this.ActiveItem.DigiDoc.AssetInfo.Id;
    } else if (this.ActiveItem.Type === "QrCode") {
      metattachData.ParentAssetInfoId = this.ActiveItem.QrCode.AssetInfo.Id;
    } else if (this.ActiveItem.Type === "Amazon") {
      metattachData.ParentAssetInfoId = this.ActiveItem.Amazon.AssetInfo.Id;
    } else if (this.ActiveItem.Type === "Google Shopping") {
      metattachData.ParentAssetInfoId = this.ActiveItem.GoogleProduct.AssetInfo.Id;
    } else if (this.ActiveItem.Type === "Upc") {
      metattachData.ParentAssetInfoId = this.ActiveItem.Product.AssetInfo.Id;
    } else if (this.ActiveItem.Type === "YouTube" || this.ActiveItem.Type === "Google Web") {
      metattachData.ParentAssetInfoId = this.ActiveItem.AssetInfo.Id;
    }

    if (
      this.LastSavedItem.Type === "DigiDoc" ||
      this.LastSavedItem.Type === "Amazon" ||
      this.LastSavedItem.Type === "Google Shopping" ||
      this.LastSavedItem.Type === "Upc"
    ) {
      metattachData.AttachmentAssetInfoId = this.AssetIndex.AssetInfoId;
    }

    metattachData.MetaType = this.LastSavedItem.Type;
    metattachData.TypeId = this.AssetIndex.Id;

    metattachData.ParentAssetInfoId = this.ActiveItem.AssetInfo.Id;

    this.metattachService.saveMetattach(metattachData).then(
      async (x) => {
        await this._loading.dismiss();
        this.uxNotifierService.showToast("Attachment created successfully!", this._constants.ToastColorGood);
        this.close();
      },
      async (err) => {
        await this._loading.dismiss();
        this.uxNotifierService.showToast("Attachment was not created!", this._constants.ToastColorBad);
      }
    );
  }

  public close() {
    this.router.navigate(["attachments"]);
  }
}
