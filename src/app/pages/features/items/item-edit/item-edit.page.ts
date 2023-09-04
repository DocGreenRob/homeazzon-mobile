import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { UploadTaskSnapshot } from "@angular/fire/compat/storage/interfaces";
import { Router } from "@angular/router";
import { BarcodeScanner } from "@awesome-cordova-plugins/barcode-scanner/ngx";
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { Chooser, ChooserOptions } from "@awesome-cordova-plugins/chooser/ngx";
import { AlertController, LoadingController, MenuController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { ActiveItem } from "src/app/models/ActiveItem";
import { AssetInfoDto } from "src/app/models/dto/AssetInfoDto";
import { AssetIndexDto } from "src/app/models/dto/interfaces/AssetIndexDto";
import { IAmazonDto } from "src/app/models/dto/interfaces/IAmazonDto";
import { IDigiDocDto } from "src/app/models/dto/interfaces/IDigiDocDto";
import { IGoogleProductDto } from "src/app/models/dto/interfaces/IGoogleProductDto";
import { IProductDto } from "src/app/models/dto/interfaces/IProductDto";
import { IQrCodeDto } from "src/app/models/dto/interfaces/IQrCodeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { BarcodeService } from "src/app/services/barcode/barcode.service";
import { CommunicatorService } from "src/app/services/communicator/communicator.service";
import { FirebaseUploadService } from "src/app/services/firebase-upload/firebase-upload.service";
import { ItemService } from "src/app/services/item/item.service";
import { ProductsService } from "src/app/services/products/products.service";
import { ProfileItemImageService } from "src/app/services/profile-item-image/profile-item-image.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { IBookmarkDto } from "../../../../models/dto/interfaces/IBookmarkDto";
import { ILineitemDto } from "../../../../models/dto/interfaces/ILineItemDto";
import { IProfileItemDto } from "../../../../models/dto/interfaces/IProfileItemDto";

@Component({
  selector: "app-item-edit",
  templateUrl: "./item-edit.page.html",
  styleUrls: ["./item-edit.page.scss"],
})
export class ItemEditPage extends BasePage {
  private _loading: any;
  private _constants: Constants;
  public _type: string;
  private _scanType: string;
  private _isFromItemAddPage: boolean;
  private _selections: any = [];
  private _selectedFile: any;
  public TempActiveItem: ActiveItem = new ActiveItem();
  public pageTitle: string = "Edit Item";
  public isQrCode: boolean = false;
  public isDisplayReady: boolean = false;
  public _bookmark: string = "";

  constructor(
    public override navController: NavController,
    private loadingCtrl: LoadingController,
    private itemService: ItemService,
    public override uxNotifierService: UxNotifierService,
    private camera: Camera,
    private firebaseService: FirebaseUploadService,
    private barcodeScanner: BarcodeScanner,
    private barcodeService: BarcodeService,
    private alertController: AlertController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    private productService: ProductsService,
    public override platform: Platform,
    private chooser: Chooser,
    public alertCtrl: AlertController,
    private profileItemImageService: ProfileItemImageService,
    private location: Location,
    public override router: Router
  ) {
    super(navController, null, communicator, menuController, platform, null, uxNotifierService, null, null);
    this._constants = new Constants();
  }

  override ngOnInit() {}

  public async ionViewDidEnter() {
    console.log("ionViewDidEnter ItemEditPage");
    //this.AppInsights.trackPageView({ name: 'ItemEditPage', properties: { userId: this.User.Id } });
    this._selections = [];

    this._type = this.QueryParams.type;
    this._isFromItemAddPage = this.QueryParams.IsFromItemAddPage;
    this.TempActiveItem = new ActiveItem();

    if (!this.IsMetattachment) {
      this.TempActiveItem = this.ActiveItem;
    } else {
      this.TempActiveItem = this.ActiveAttachmentItem;
    }

    if (this._isFromItemAddPage) {
      this.pageTitle = "Add Item";

      switch (this._type) {
        case "camera":
          this.processSelections();
          break;
        case "Bookmark":
          this._bookmark = this.ActiveItem.Bookmark.Url; // TODO: what happens when not for bookmark?
          // show form to capture input
          this.isDisplayReady = true;
          break;
        case "file":
          this.processSelections();
          break;
        default:
          alert("Fix this! (handle this)");
          throw new Error("Handle this call!");
      }
    } else {
      this.isDisplayReady = true;
      if (this._type !== undefined && this._type !== null && this._type !== "") {
        this.pageTitle = "Add Item";
        this.TempActiveItem.AssetInfo = new AssetInfoDto();
        console.log("tempActiveItem 89", this.TempActiveItem);

        switch (this._type) {
          case "camera":
            this.launchCamera();
            break;
          case "barcode":
            this.launchBarcode();
            break;
          case "file":
            this.launchFileExplorer();
            break;
        }
      }
    }
  }

  // ** unused methods **/

  public updateItemLineitems() {}

  public updateItemLocation() {}

  // ** end unused methods **/

  public override launchCamera() {
    if (this.platform.is("mobileweb")) {
      this.TempActiveItem.Image =
        "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fsolid%2Fcamera.svg?alt=media&token=e0af850d-247e-41a0-84ff-e6faa5e815b6";
    } else {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        sourceType: this.camera.PictureSourceType.CAMERA,
        correctOrientation: true,
        allowEdit: false,
      };

      this.camera.getPicture(options).then(
        (imageData) => {
          this.TempActiveItem.Image = "data:image/jpeg;base64," + imageData;
        },
        (error) => {
          console.log(error);
          let sourceParams = this.QueryParams.sourceParamsCamera;
          let componentName = this.QueryParams.sourceCamera;
          if (componentName == "DashboardPage") {
            this.router.navigate(["dashboard"]);
          } else {
            this.QueryParams = sourceParams;
            this.router.navigate([componentName]);
          }
        }
      );
    }
  }

  public override launchBarcode() {
    if (this.platform.is("mobileweb")) {
      let type: string = "UPC_A"; // QR_CODE
      let barcode: string = "99999999";
      this._scanType = type;

      if (type === "UPC_A") {
        // setup view
        this.TempActiveItem.Image =
          "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Fbarcode-alt.svg?alt=media&token=9a36a6dc-880c-45ee-971d-4b72a7a938dd";
        this.TempActiveItem.AssetInfo.Title = "Dummy Product";
        this.TempActiveItem.AssetInfo.Price = 9.99;

        // setup Dto for Api
        let product: IProductDto = {} as IProductDto;
        product.Id = 0;
        product.Name = this.TempActiveItem.AssetInfo.Title;
        product.Image = this.TempActiveItem.Image;
        product.BarCode = barcode;
        product.BarCodeType = type;
        product.Price = this.TempActiveItem.AssetInfo.Price;
        this.TempActiveItem.Product = product;
      } else {
        this.isQrCode = true;

        // setup view
        this.TempActiveItem.Image =
          "https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fqrcode.svg?alt=media&token=d2f01c14-b5b7-4248-b666-0fcd6584c0a6";

        // setup Dto for Api
        let qrCode: IQrCodeDto = {} as IQrCodeDto;
        qrCode.Url = barcode;
        this.TempActiveItem.QrCode = qrCode;
      }
    } else {
      this.barcodeScanner
        .scan()
        .then((barcode) => {
          this._scanType = barcode.format;
          if (barcode.format != "QR_CODE") {
            this.barcodeService.getBarCodeData(barcode.text).subscribe(
              (response: any) => {
                // setup view
                this.TempActiveItem.Image = response.ImageUrl;
                this.TempActiveItem.AssetInfo.Title = response.ProductName;
                this.TempActiveItem.AssetInfo.Price = response.Price;

                // setup Dto for Api
                let product: IProductDto = {} as IProductDto;
                product.Id = 0;
                product.Name = response.ProductName;
                product.Image = response.ImageUrl;
                product.BarCode = barcode.text;
                product.BarCodeType = barcode.format;
                product.Price = response.Price;
                this.TempActiveItem.Product = product;
              },
              async (err) => {
                this.uxNotifierService.showToast("Upc Code not found!", this._constants.ToastColorBad);
                const prompt = await this.alertController.create({
                  header: "Take A Picture",
                  message: "Upc Code was not found, Do you want to take a picture?",
                  buttons: [
                    {
                      text: "No",
                      handler: () => {
                        this.navController.pop();
                      },
                    },
                    {
                      text: "Yes",
                      handler: () => {
                        this._type = "camera";
                        this.launchCamera();
                      },
                    },
                  ],
                });
                await prompt.present();
              }
            );
          } else {
            this.isQrCode = true;

            // setup view
            this.TempActiveItem.Image =
              "https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fqrcode.svg?alt=media&token=d2f01c14-b5b7-4248-b666-0fcd6584c0a6";

            // setup Dto for Api
            let qrCode: IQrCodeDto = {} as IQrCodeDto;
            qrCode.Url = barcode.text;
            this.TempActiveItem.QrCode = qrCode;
          }
        })
        .catch((err) => {
          this.uxNotifierService.showToast("There was an error scanning the barcode/qr code!", this._constants.ToastColorBad);
        });
    }
  }

  public override async launchFileExplorer() {
    let accept: ChooserOptions = {
      mimeTypes:
        "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    await this.chooser
      .getFile(accept)
      .then((file) => {
        if (file) {
          if (file.mimeType == "application/pdf") {
            this.TempActiveItem.Image =
              "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-pdf.svg?alt=media&token=ec5d1f8a-8393-4b64-9a5b-5cc75ee01660";
          } else if (file.mimeType == "application/msword" || file.mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            this.TempActiveItem.Image =
              "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-word.svg?alt=media&token=f2f34448-fefe-4cbe-bcc7-0e2fe9ae0ef2";
          } else if (file.mimeType == "application/vnd.ms-excel" || file.mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.TempActiveItem.Image =
              "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-excel.svg?alt=media&token=853b9d8f-3040-4540-8e7a-a33da225e793";
          } else if (
            file.mimeType == "application/vnd.ms-powerpoint" ||
            file.mimeType == "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          ) {
            this.TempActiveItem.Image =
              "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-powerpoint.svg?alt=media&token=a603f641-db7d-408c-8622-ed0c628cbe7e";
          } else if (file.mimeType == "image/png" || file.mimeType == "image/jpeg") {
            this.TempActiveItem.Image = file.path;
          }

          this._selectedFile = file;
        } else {
          this.fileUploadExceptionHandler();
        }
      })
      .catch(() => {
        this.fileUploadExceptionHandler();
      });
  }

  private fileUploadExceptionHandler() {
    this.navController.pop();
    this.uxNotifierService.showToast("File selection Cancelled", this._constants.ToastColorBad);
  }

  private async saveToFirebase(file: any): Promise<UploadTaskSnapshot> {
    let fileName = new Date().getTime() * 10000 + 621355968000000000;
    let uploadTaskSnapshot: UploadTaskSnapshot;

    if (this._type === "file") {
      await this.firebaseService.uploadOtherFiles(file, fileName, this.User.Id).then(
        (x) => {
          uploadTaskSnapshot = x;
        },
        (err) => {
          // add telemetry logging
          if (this._loading != undefined) {
            this._loading.dismiss();
          }

          this.uxNotifierService.showToast("An Error occured while uploading the file. Please try again Later", this._constants.ToastColorBad);
        }
      );
    } else {
      await this.firebaseService.uploadImage(file, fileName, this.User.Id).then(
        (x) => {
          uploadTaskSnapshot = x;
        },
        (err) => {
          // add telemetry logging
          if (this._loading != undefined) {
            this._loading.dismiss();
          }

          this.AppInsights.trackEvent({
            name: "Camera.saveDigiDocToFirebase()saveToFirebase().firebaseService.uploadImage().catch()",
            properties: [
              {
                error: err,
              },
            ],
          });

          this.AppInsights.trackException({
            error: err,
            id: "Camera.saveDigiDocToFirebase()saveToFirebase().firebaseService.uploadImage().catch()",
          });

          this.uxNotifierService.showToast("An Error occured while uploading the file. Please try again Later", this._constants.ToastColorBad);
        }
      );
    }

    return uploadTaskSnapshot;
  }

  private processSelections() {
    // used for handling image saves to profile item
    if (this._type != "Bookmark") {
      let x = localStorage.getItem("TempActiveItem");
      let y = JSON.parse(x);
      this.TempActiveItem = y;
    }

    let originalProfileItem: IProfileItemDto = this.ProfileItem;
    let selections = localStorage.getItem("Selections");
    this._selections = JSON.parse(selections);

    let ctr: number = 0;

    this._selections.forEach(async (selectedProfileItem) => {
      ctr++;

      // TODO: What happens when it is Amazon, YouTube, Google Shopping, or Google Web?
      if (this._type != "Amazon" && this._type != "YouTube" && this._type != "Google Shopping" && this._type != "Google Web") {
        if (selectedProfileItem.IsSaveToRoom) {
          let profileItem: IProfileItemDto = {} as IProfileItemDto;
          profileItem.Id = selectedProfileItem.Id;
          this.ProfileItem = profileItem;
          await this.addCameraBarcodeFile(profileItem, null, true).then(
            () => {
              if (ctr == this._selections.length) {
                this.ProfileItem = originalProfileItem;
              }
            },
            (err) => {}
          );
        } else {
          if (this._type == "Bookmark") {
            // go through each lineitem
            selectedProfileItem.Lineitems.forEach(async (i) => {
              if (i.IsChecked) {
                await this.addBookmark(selectedProfileItem.Id, i.Id);
              }
            });
          } else {
            selectedProfileItem.Lineitems.forEach(async (x) => {
              if (x.IsChecked) {
                await this.addCameraBarcodeFile(selectedProfileItem, x, false).then(
                  () => {},
                  (err) => {}
                );
              }
            });
          }
        }
      }
    });

    // on the last one, do the close out things... :-)
    if (ctr === this._selections.length) {
      this.showSave();
    }
  }

  private async addBookmark(
    profileItemId: number = this.ProfileItem.Id,
    lineitemId: number = this.LineItem.Id,
    isMy: boolean = false,
    isWishlist: boolean = false
  ) {
    let tempBookmark: IBookmarkDto = {} as IBookmarkDto;
    tempBookmark.Url = this.TempActiveItem.Bookmark.Url;
    let tempIndex: AssetIndexDto = {} as AssetIndexDto;
    tempIndex.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
    tempIndex.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
    tempIndex.ProfileItemId = profileItemId;
    tempIndex.LineitemId = lineitemId;
    tempIndex.IsMy = this.IsMetattachment ? false : isMy ?? false;
    tempIndex.IsWishlist = this.IsMetattachment ? false : isWishlist ?? false;
    tempIndex.IsSuggest = this.IsMetattachment ? false : this.IsSuggest ?? false;
    tempBookmark.Index = tempIndex;
    tempBookmark.AssetInfo = this.TempActiveItem.AssetInfo;

    await this.itemService.upsertBookmark(tempBookmark, this.ProfileItem.Id, this.UserTypes).then(
      () => {
        this.IsMy = false;
        this.IsWishlist = false;
        this.IsSuggest = false;
      },
      (err) => {}
    );
  }

  private async showSave() {
    this.uxNotifierService.showToast("Saved successfully!", this._constants.ToastColorGood);
    let source = this.QueryParams.source;

    if (source !== null) {
      if (source === "DashboardPage") {
        this.router.navigate(["dashboard"]);
      } else {
        try {
          this.router.navigate(this.QueryParams.returnRoute.substring(1));
        } catch (e) {
          this.router.navigate(["dashboard"]);
        }
      }
    } else {
      this.router.navigate(["dashboard"]);
    }
  }

  private async addCameraBarcodeFile(profileItem: IProfileItemDto, lineitem: ILineitemDto, isSaveToRoom: boolean) {
    // if adding using update interface (camera, barcode, or file)...
    if (this.pageTitle == "Add Item" && this._type == "camera") {
      // upload to firebase
      await this.saveDigiDocToFirebase(this.TempActiveItem.Image, "png", isSaveToRoom, profileItem, lineitem);
    }

    if (this.pageTitle == "Add Item" && this._type == "barcode") {
      if (this._scanType == "QR_CODE") {
        this.TempActiveItem.QrCode.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
        this.TempActiveItem.QrCode.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
        this.TempActiveItem.QrCode.ProfileItemId = profileItem.Id;
        this.TempActiveItem.QrCode.LineItemId = lineitem.Id;
        this.TempActiveItem.QrCode.IsMy = this.IsMetattachment ? false : this.IsMy ?? false;
        this.TempActiveItem.QrCode.IsWishlist = this.IsMetattachment ? false : this.IsWishlist ?? false;
        this.TempActiveItem.QrCode.IsSuggest = this.IsMetattachment ? false : this.IsSuggest ?? false;
        this.TempActiveItem.QrCode.IsMetattach = this.IsMetattachment;
        this.TempActiveItem.QrCode.AssetInfo = this.ActiveItem.AssetInfo;

        let lastSavedItem: any = this.TempActiveItem.QrCode;
        lastSavedItem.Type = "Qr Code";
        this.LastSavedItem = lastSavedItem;

        await this.barcodeService.postQrCode(this.TempActiveItem.QrCode).then(
          (x: AssetIndexDto) => {
            localStorage.setItem("AssetIndex", JSON.stringify(x));
            if (this._loading != undefined) {
              this._loading.dismiss();
            }
            if (!this._isFromItemAddPage) {
              this.uxNotifierService.showToast("Qr Code was saved successfully!", this._constants.ToastColorGood);
            }

            if (this.IsMetattachment) {
              this.router.navigate(["CreateMetattachPage"]);
            } else {
              if (!this._isFromItemAddPage) {
                this.close();
              }
            }
          },
          (err) => {
            if (this._loading != undefined) {
              this._loading.dismiss();
            }
            this.uxNotifierService.showToast("Qr Code was not saved!", this._constants.ToastColorBad);
          }
        );
      } else {
        this.TempActiveItem.Product.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
        this.TempActiveItem.Product.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
        this.TempActiveItem.Product.ProfileItemId = profileItem.Id;
        this.TempActiveItem.Product.LineItemId = lineitem.Id;
        this.TempActiveItem.Product.IsMy = this.IsMetattachment ? false : this.IsMy ?? false;
        this.TempActiveItem.Product.IsWishlist = this.IsMetattachment ? false : this.IsWishlist ?? false;
        this.TempActiveItem.Product.IsSuggest = this.IsMetattachment ? false : this.IsSuggest ?? false;
        this.TempActiveItem.Product.IsMetattach = this.IsMetattachment;
        this.TempActiveItem.Product.Name = this.TempActiveItem.AssetInfo.Title;
        this.TempActiveItem.Product.AssetInfo = this.TempActiveItem.AssetInfo;

        let lastSavedItem: any = this.TempActiveItem.Product;
        lastSavedItem.Type = "Upc";
        this.LastSavedItem = lastSavedItem;

        await this.barcodeService.postBarcodeProduct(this.TempActiveItem.Product).then(
          (x: AssetIndexDto) => {
            localStorage.setItem("AssetIndex", JSON.stringify(x));
            if (this._loading != undefined) {
              this._loading.dismiss();
            }

            if (!this._isFromItemAddPage) {
              this.uxNotifierService.showToast("Upc product was saved successfully!", this._constants.ToastColorGood);
            }

            if (this.IsMetattachment) {
              this.router.navigate(["CreateMetattachPage"]);
            } else {
              if (!this._isFromItemAddPage) {
                this.close();
              }
            }
          },
          (err) => {
            if (this._loading != undefined) {
              this._loading.dismiss();
            }
            this.uxNotifierService.showToast("Upc product was not saved!", this._constants.ToastColorBad);
          }
        );
      }
    }

    if (this.pageTitle == "Add Item" && this._type == "file") {
      await this.saveDigiDocToFirebase(
        this._selectedFile,
        this._selectedFile == undefined ? "" : this._selectedFile.mediaType,
        isSaveToRoom,
        profileItem,
        lineitem
      );
    }
  }

  private async showMyOrWishlistModalAsync() {
    (
      await this.alertCtrl.create({
        message: "Which list does this go into?",
        buttons: [
          {
            text: "Wishlist",
            cssClass: "signout",
            handler: async () => {
              this.IsWishlist = true;
              await this.saveAsync();
            },
          },
          {
            text: "My Stuff",
            cssClass: "signout",
            handler: async () => {
              this.IsMy = true;
              await this.saveAsync();
            },
          },
        ],
      })
    ).present();
  }

  private async saveAsync() {
    if (this._type === "Bookmark" && this.pageTitle === "Add Item") {
      if (!this.TempActiveItem.AssetInfo.Title) {
        (
          await this.alertCtrl.create({
            subHeader: "Error",
            message: "Please enter the title.",
            buttons: ["Ok"],
          })
        ).present();
        return;
      }

      if (!this.LineItem || this.LineItem.Id === undefined) {
        this.processSelections();
      } else {
        await this.addBookmark(this.ProfileItem.Id, this.LineItem.Id, this.IsMy, this.IsWishlist);
        await this.showSave();
      }
    } else {
      this._loading = await this.loadingCtrl.create({
        message: "saving...",
        cssClass: "my-loading-class",
      });
      if (this.LineItem == undefined || this.LineItem.Id == undefined) {
        // show screens
        console.log("LineItem", this.LineItem);

        ///This is to save selected file to firebase.
        ///Since we are not able to persist the selected file, we will save it to firebase and persist the url.
        ///Can be changed in future.
        if (this._type === "file" && this._selectedFile != undefined) {
          this._loading.present();
          await this.saveToFirebase(this._selectedFile).then(
            (x: UploadTaskSnapshot) => {
              debugger;
              x.ref
                .getDownloadURL()
                .then(async (url) => {
                  debugger;
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  localStorage.setItem("SelectedFileContentType", this._selectedFile.mediaType);
                  localStorage.setItem("SelectedFileURL", url);
                })
                .catch((x) => {
                  // add telemetry logging
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("An Error occured while uploading the file.Please try again Later", this._constants.ToastColorBad);
                });
            },
            (err) => {}
          );
        }
        localStorage.setItem("TempActiveItem", JSON.stringify(this.TempActiveItem));
        this.QueryParams = { Image: this.TempActiveItem.Image, type: this._type };
        this.router.navigate(["item-add"]);
      } else {
        if (this.TempActiveItem.AssetInfo.Title == "") {
          (
            await this.alertCtrl.create({
              subHeader: "Error",
              message: "Please enter the title.",
              buttons: ["Ok"],
            })
          ).present();
          return;
        }

        //this._loading = this.loadingCtrl.create({
        //	content: 'saving...',
        //	cssClass: 'my-loading-class'
        //});
        this._loading.present();

        if (this._type != "Amazon" && this._type != "YouTube" && this._type != "Google Shopping" && this._type != "Google Web") {
          await this.addCameraBarcodeFile(this.ProfileItem, this.LineItem, false);
        }

        // if updating
        if (this.pageTitle != "Add Item") {
          switch (this.TempActiveItem.AssetInfo.Type) {
            case "GoogleProduct":
              let googleProductDto: IGoogleProductDto = {} as IGoogleProductDto;
              googleProductDto.Id = this.TempActiveItem.Id;
              googleProductDto.Name = this.TempActiveItem.Name;
              googleProductDto.Description = this.TempActiveItem.AssetInfo.Description;
              googleProductDto.Price = this.TempActiveItem.AssetInfo.Price;
              googleProductDto.IsMetattach = this.IsMetattachment;
              googleProductDto.AssetInfo = this.TempActiveItem.AssetInfo;

              this.itemService.updateGoogleProduct(googleProductDto, this.UserTypes).then(
                () => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item updated successfully!", this._constants.ToastColorGood);
                  this.close();
                },
                (err) => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item was not updated!", this._constants.ToastColorBad);
                }
              );

              break;
            case "Amazon":
              let amazonDto: IAmazonDto = {} as IAmazonDto;
              amazonDto.Id = this.TempActiveItem.Id;
              amazonDto.Name = this.TempActiveItem.AssetInfo.Title;
              amazonDto.Description = this.TempActiveItem.AssetInfo.Description;
              amazonDto.Price = this.TempActiveItem.AssetInfo.Price;
              amazonDto.IsMetattach = this.IsMetattachment;
              amazonDto.AssetInfo = this.TempActiveItem.AssetInfo;

              this.itemService.updateAmazon(amazonDto, this.ProfileItem.Id, this.UserTypes).then(
                () => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item updated successfully!", this._constants.ToastColorGood);
                  this.close();
                },
                (err) => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item was not updated!", this._constants.ToastColorBad);
                }
              );
              break;
            case "DigiDoc":
              let digiDocDto: IDigiDocDto = {} as IDigiDocDto;
              digiDocDto.Id = this.TempActiveItem.Id;
              digiDocDto.IsMetattach = this.IsMetattachment;
              digiDocDto.AssetInfo = this.TempActiveItem.AssetInfo;
              this.itemService.upsertDigiDoc(digiDocDto, this.UserTypes).then(
                () => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item updated successfully!", this._constants.ToastColorGood);
                  this.close();
                },
                (err) => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item was not updated!", this._constants.ToastColorBad);
                }
              );
              break;
            case "Product":
              let productDto: IProductDto = {} as IProductDto;
              productDto.Id = this.TempActiveItem.Id;
              productDto.Name = this.TempActiveItem.Name;
              productDto.Price = this.TempActiveItem.AssetInfo.Price;
              productDto.IsMetattach = this.IsMetattachment;
              productDto.AssetInfo = this.TempActiveItem.AssetInfo;

              this.barcodeService.postBarcodeProduct(productDto).then(
                () => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item updated successfully!", this._constants.ToastColorGood);
                  this.close();
                },
                (err) => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item was not updated!", this._constants.ToastColorBad);
                }
              );
              break;
            case "Bookmark":
              let bookmark: IBookmarkDto = {} as IBookmarkDto;
              bookmark.Id = this.TempActiveItem.Id;
              bookmark.Url = this.TempActiveItem.Name;
              bookmark.AssetInfo = this.TempActiveItem.AssetInfo;

              this.itemService.upsertBookmark(bookmark, this.ProfileItem.Id, this.UserTypes).then(
                () => {
                  if (this._loading != undefined) {
                    this._loading.dismiss();
                  }
                  this.uxNotifierService.showToast("Item updated successfully!", this._constants.ToastColorGood);
                  this.close();
                },
                (err) => {
                  if (err.status == "200") {
                    // not sure why it is erroring even when the server is returning a 200
                    // also, same endpoint is working fine when creating bookmark...only issue with
                    // handler during update
                    if (this._loading != undefined) {
                      this._loading.dismiss();
                    }
                    this.uxNotifierService.showToast("Item updated successfully!", this._constants.ToastColorGood);
                    this.close();
                  } else {
                    if (this._loading != undefined) {
                      this._loading.dismiss();
                    }
                    this.uxNotifierService.showToast("Item was not updated!", this._constants.ToastColorBad);
                  }
                }
              );
              break;
          }
        }

        if (!this.IsMetattachment) {
          this.ActiveItem = this.TempActiveItem;
        } else {
          this.ActiveAttachmentItem = this.TempActiveItem;
        }
      }
    }
  }

  public async save() {
    if (!this.IsMetattachment) {
      await this.showMyOrWishlistModalAsync();
    } else {
      await this.saveAsync();
    }
  }

  async saveDigiDocToFirebase(file: any, contentType: string, isSaveToRoom: boolean, profileItem: IProfileItemDto, lineitem: ILineitemDto) {
    if (this.platform.is("mobileweb")) {
      await this.postDigiDocToApi(this.TempActiveItem.Image, "png", isSaveToRoom, profileItem, lineitem);
    } else {
      let fileURL = localStorage.getItem("SelectedFileURL");
      let fileContentType = localStorage.getItem("SelectedFileContentType");

      this.AppInsights.trackEvent({
        name: "Camera.saveDigiDocToFirebase()",
        properties: [
          {
            fileURL: fileURL,
            fileContentType: fileContentType,
            file: file,
            contentType: contentType,
            isSaveToRoom: isSaveToRoom,
            profileItem: profileItem,
            lineitem: lineitem,
          },
        ],
      });

      if (fileURL) {
        if (this._loading != undefined) {
          this._loading.dismiss();
        }

        localStorage.removeItem("SelectedFileURL");
        localStorage.removeItem("SelectedFileContentType");

        await this.postDigiDocToApi(fileURL, fileContentType, isSaveToRoom, profileItem, lineitem);
      } else {
        await this.saveToFirebase(file).then(
          (x: UploadTaskSnapshot) => {
            x.ref
              .getDownloadURL()
              .then(async (url) => {
                await this.postDigiDocToApi(url, contentType, isSaveToRoom, profileItem, lineitem);
              })
              .catch((x) => {
                this.AppInsights.trackEvent({
                  name: "Camera.saveDigiDocToFirebase()saveToFirebase().catch()",
                  properties: [
                    {
                      error: x,
                    },
                  ],
                });

                this.AppInsights.trackException({
                  error: x,
                  id: "Camera.saveDigiDocToFirebase()saveToFirebase().catch()",
                });

                if (this._loading != undefined) {
                  this._loading.dismiss();
                }

                this.uxNotifierService.showToast("An Error occured while uploading the file.Please try again Later", this._constants.ToastColorBad);
              });
          },
          (err) => {}
        );
      }
    }
  }

  public async postDigiDocToApi(url: string, contentType: string, isSaveToRoom: boolean, profileItem: IProfileItemDto, lineitem: ILineitemDto) {
    // save in db
    let digiDocDto: IDigiDocDto = {} as IDigiDocDto;
    digiDocDto.Id = 0;
    digiDocDto.ContentType = contentType;
    digiDocDto.Url = url;
    digiDocDto.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
    digiDocDto.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
    digiDocDto.ProfileItemId = profileItem.Id;
    digiDocDto.LineItemId = lineitem == undefined || lineitem == null ? 0 : lineitem.Id;
    digiDocDto.IsMy = this.IsMetattachment ? false : this.IsMy ?? false;
    digiDocDto.IsWishlist = this.IsMetattachment ? false : this.IsWishlist ?? false;
    digiDocDto.IsSuggest = this.IsMetattachment ? false : this.IsSuggest ?? false;
    digiDocDto.IsMetattach = this.IsMetattachment;
    digiDocDto.AssetInfo = this.TempActiveItem.AssetInfo;
    console.log("digiDocDto", digiDocDto);
    let lastSavedItem: any = digiDocDto;
    lastSavedItem.Type = "DigiDoc";
    this.LastSavedItem = lastSavedItem;

    if (isSaveToRoom) {
      await this.profileItemImageService.upsertProfileItemImageAsync(digiDocDto, this.UserTypes).then(
        () => {
          if (this._loading != undefined) {
            this._loading.dismiss();
          }
        },
        (err) => {
          console.log("error saving profileitem image", err);
        }
      );
    } else {
      this.itemService.upsertDigiDoc(digiDocDto, this.UserTypes).then(
        (x: AssetIndexDto) => {
          localStorage.setItem("AssetIndex", JSON.stringify(x));
          if (this._loading != undefined) {
            this._loading.dismiss();
          }

          if (!this._isFromItemAddPage) {
            this.uxNotifierService.showToast("DigiDoc was saved successfully!", this._constants.ToastColorGood);
          }

          if (this.IsMetattachment) {
            this.router.navigate(["create-metattach"]);
          } else {
            if (!this._isFromItemAddPage) {
              this.close();
            }
          }
        },
        (err) => {
          if (this._loading != undefined) {
            this._loading.dismiss();
          }
          this.uxNotifierService.showToast("DigiDoc was not saved!", this._constants.ToastColorBad);
        }
      );
    }
  }

  public close() {
    this.location.back();
    this.IsMy = false;
    this.IsWishlist = false;
    this.IsSuggest = false;
  }

  override selectInput(event) {
    event.target.select();
  }
}
