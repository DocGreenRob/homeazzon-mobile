import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { LoadingController, NavController, Platform } from "@ionic/angular";
import { IGrid } from "src/app/models/dto/interfaces/IGrid";
import { IGridList } from "src/app/models/dto/interfaces/IGridList";
import { IMetattachmentDto } from "src/app/models/dto/interfaces/IMetattachmentDto";
import { BasePage } from "src/app/pages/base/base.page";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { Constants } from "./../../../../common/Constants";
import { MetattachService } from "./../../../../services/metattach/metattach.service";

@Component({
  selector: "app-attachments",
  templateUrl: "./attachments.page.html",
  styleUrls: ["./attachments.page.scss"],
})
export class AttachmentsPage extends BasePage {
  public data: IGrid;

  private _loading: any;
  private _constants = new Constants();
  isShowSave: boolean = false;

  constructor(
    public override navController: NavController,
    public metattachService: MetattachService,
    private loadingCtrl: LoadingController,
    public override router: Router,
    private activeRouter: ActivatedRoute,
    public override inAppBrowser: InAppBrowser,
    public override platform: Platform,
    public override uxNotifierService: UxNotifierService
  ) {
    super(navController, null, null, null, platform, router, uxNotifierService, null, null, inAppBrowser);
  }

  override ngOnInit() {
    console.log("ngOnInit AttachmentsPage");
    //this.AppInsights.trackPageView({ name: 'AttachmentsPage' });
  }

  ionViewDidEnter() {
    //refresh everytime we get into the page
    this.start();
  }

  public async start() {
    this._loading = await this.loadingCtrl.create({
      message: "getting attachments...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();

    localStorage.setItem("IsMetattachment", JSON.stringify(true));

    this.metattachService.getMetattachments(this.ActiveItem.AssetInfo.Id).then(
      (response: Array<Array<IMetattachmentDto>>) => {
        localStorage.setItem("Metattachments", JSON.stringify(response));

        let grid: IGrid = { Lists: [] };
        let gridList: IGridList = null;

        for (let i: number = 0; i < response.length; i++) {
          for (let j: number = 0; j < response[i].length; j++) {
            if (j === 0) {
              gridList = {
                Name: response[i][j].Type,
                Items: [],
              };
            }

            let image: string =
              "https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fpencil.svg?alt=media&token=4534ffd7-bd6a-48fe-90d0-44eed30a3191";
            let entityType: string = "";
            let entityId: number = 0;

            if (response[i][j].Amazon !== undefined && response[i][j].Amazon !== null) {
              image = response[i][j].Amazon.Image;
              entityId = response[i][j].Amazon.Id;
              entityType = "Amazon";
            }
            if (response[i][j].GoogleProduct !== undefined && response[i][j].GoogleProduct !== null) {
              image = response[i][j].GoogleProduct.Image;
              entityId = response[i][j].GoogleProduct.Id;
              entityType = "Google Shopping";
            }
            if (response[i][j].DigiDoc !== undefined && response[i][j].DigiDoc !== null) {
              image = response[i][j].DigiDoc.Url;
              let contentType: string = response[i][j].DigiDoc.ContentType;

              if (contentType == "application/pdf") {
                image =
                  "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-pdf.svg?alt=media&token=ec5d1f8a-8393-4b64-9a5b-5cc75ee01660";
              } else if (contentType == "application/msword" || contentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                image =
                  "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-word.svg?alt=media&token=f2f34448-fefe-4cbe-bcc7-0e2fe9ae0ef2";
              } else if (contentType == "application/vnd.ms-excel" || contentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                image =
                  "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-excel.svg?alt=media&token=853b9d8f-3040-4540-8e7a-a33da225e793";
              } else if (
                contentType == "application/vnd.ms-powerpoint" ||
                contentType == "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              ) {
                image =
                  "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-powerpoint.svg?alt=media&token=a603f641-db7d-408c-8622-ed0c628cbe7e";
              }
              entityId = response[i][j].DigiDoc.Id;
              entityType = "DigiDoc";
            }
            if (response[i][j].YouTube !== undefined && response[i][j].YouTube !== null) {
              image = response[i][j].YouTube.ThumbnailImg;
              entityId = response[i][j].YouTube.Id;
              entityType = "YouTube";
            }
            if (response[i][j].GoogleText !== undefined && response[i][j].GoogleText !== null) {
              image =
                "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Fglobe.svg?alt=media&token=aac6d1a7-8dd1-4b35-bac1-b0961b6e50fc";
              entityId = response[i][j].GoogleText.Id;
              entityType = "Google Web";
            }
            if (response[i][j].Product !== undefined && response[i][j].Product !== null) {
              image = response[i][j].Product.Image;
              entityId = response[i][j].Product.Id;
              entityType = "Upc";
            }
            if (response[i][j].QRCode !== undefined && response[i][j].QRCode !== null) {
              image =
                "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Fqrcode.svg?alt=media&token=80c296d2-280c-4c42-aa19-50b0027fe89a";
              entityId = response[i][j].QRCode.Id;
              entityType = "Qr Code";
            }

            gridList.Items.push({
              Id: response[i][j].Id,
              Name: response[i][j].Name,
              Notes: response[i][j].Notes,
              ImagePath: image,
              IconPath: null,
              EntityType: entityType,
              EntityId: entityId,
              TypeId: response[i][j].TypeId,
              AttachmentType: response[i][j].Type,
            });
          }

          grid.Lists.push(gridList);
        }

        this.data = grid;

        this._loading.dismiss();
      },
      (err) => {
        this._loading.dismiss();
        this.uxNotifierService.showToast("An error occurred while getting some resources.Please try again later", this._constants.ToastColorBad);
      }
    );
  }

  public attachmentClickEventHandler(gridList: IGridList) {
    let attachment: IMetattachmentDto = {} as IMetattachmentDto;
    attachment.Id = gridList.Items[0].Id;
    attachment.Name = gridList.Items[0].Name;
    attachment.Notes = gridList.Items[0].Notes;
    attachment.Type = gridList.Items[0].AttachmentType;
    attachment.TypeId = gridList.Items[0].TypeId;
    this.ActiveAttachment = attachment;

    if (gridList.Name === "General Document") {
      let url: string = this.Metattachments.filter((x) => x[0].Type == gridList.Name)[0].filter((x) => x.Id == attachment.Id)[0].DigiDoc.Url;
      let iab = this.inAppBrowser.create(url, "_system");
      let script: any;
      iab.executeScript(script);
    } else {
      this.QueryParams = {
        SelectedAttachment: gridList.Items[0],
      };
      this.router.navigate(["item-details"]);
    }
  }

  public close() {
    this.IsMetattachment = false;
    this.router.navigate(["item-details"]);
  }
}
