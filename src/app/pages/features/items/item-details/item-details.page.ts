import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { LoadingController, MenuController, ModalController, NavController, NavParams, Platform, AlertController } from "@ionic/angular";
//import { constants } from 'perf_hooks';
import { Constants, DocumentFileTypes, ImageFileTypes } from "src/app/common/Constants";
import { ActiveItem } from "src/app/models/ActiveItem";
import { ArtifactIndexTagDto } from "src/app/models/dto/interfaces/ArtifactIndexTagDto";
import { IAmazonDto } from "src/app/models/dto/interfaces/IAmazonDto";
import { IDigiDocDto } from "src/app/models/dto/interfaces/IDigiDocDto";
import { IGoogleProductDto } from "src/app/models/dto/interfaces/IGoogleProductDto";
import { IItemDto } from "src/app/models/dto/interfaces/IItemDto";
import { IProductDto } from "src/app/models/dto/interfaces/IProductDto";
import { IQrCodeDto } from "src/app/models/dto/interfaces/IQrCodeDto";
import { ITagContextDto } from "src/app/models/dto/interfaces/ITagContextDto";
import { IYouTubeDto } from "src/app/models/dto/interfaces/IYouTubeDto";
import { BasePage } from "src/app/pages/base/base.page";
import { ArtifactIndexService } from "src/app/services/artifact-index/artifact-index.service";
import { ItemService } from "src/app/services/item/item.service";
import { TagService } from "src/app/services/tag/tag.service";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { AssetInfoDto } from "../../../../models/dto/AssetInfoDto";
import { BookmarkDto } from "../../../../models/dto/interfaces/BookmarkDto";
import { IContactInformationDto } from "../../../../models/dto/interfaces/IContactInformationDto";
import { IProfileItemImageDto } from "../../../../models/dto/interfaces/IProfileItemImageDto";
import { ContactInformationService } from "../../../../services/contact-information/contact-information.service";
import { ProfileItemImageService } from "../../../../services/profile-item-image/profile-item-image.service";
import { AddRoomModalPage } from "../../../modals/add-room-modal/add-room-modal.page";
import { ContactInformationModalPage } from "../../../modals/contact-information-modal/contact-information-modal.page";
import { IGoogleLinkDto } from "./../../../../models/dto/interfaces/IGoogleLinkDto";
import { CommunicatorService } from "./../../../../services/communicator/communicator.service";
import { MetattachService } from "./../../../../services/metattach/metattach.service";

@Component({
  selector: "app-item-details",
  templateUrl: "./item-details.page.html",
  styleUrls: ["./item-details.page.scss"],
})
export class ItemDetailsPage extends BasePage {
  private _loading: any;
  private _constants: Constants;
  private _isDeleteItemFromCategories: boolean = false;
  public isHideSegments: boolean = false;
  public videoUrl: SafeResourceUrl;
  public imageFileTypes = ImageFileTypes;
  public docFileTypes = DocumentFileTypes;
  _sanitizedUrl: any;

  /*For Tags Feature*/
  form: FormGroup;
  public tagContextList = []; //[{ value: 0, display: 'Angular' }, { value: 1, display: 'React' }];
  public selectedTagItems = [];
  constructor(
    public override navController: NavController,
    public override navParams: NavParams,
    private itemService: ItemService,
    private loadingCtrl: LoadingController,
    public override uxNotifierService: UxNotifierService,
    private sanitizerService: DomSanitizer,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    private attachmentService: MetattachService,
    public override inAppBrowser: InAppBrowser,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    public override userTypesService: UserTypesService,
    public profileItemImageService: ProfileItemImageService,
    public sanitizer: DomSanitizer,
    private tagService: TagService,
    private formBuilder: FormBuilder,
    private artifactIndexService: ArtifactIndexService,
    private modalCtrl: ModalController,
    private contactInformationService: ContactInformationService,
    private alertCtrl: AlertController
  ) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, null, inAppBrowser);
    this._constants = new Constants();
    this.form = this.formBuilder.group({
      code: [],
      tags: [[]],
    });
  }

  override async ngOnInit() {
    await this.tagService.getAllTags().then((tagList: Array<ITagContextDto>) => {
      this.tagContextList = this.createTagsModel(tagList);
    });
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter ItemDetailsPage");
    //this.AppInsights.trackPageView({ name: 'ItemDetailsPage' });
    this.start();
    console.log("ActiveItem.Name", this.ActiveItem.Name);
  }

  private async start() {
    //https://docs.google.com/viewer?url=&embedded=true
    this._loading = await this.loadingCtrl.create({
      message: "getting details...",
      cssClass: "my-loading-class",
    });

    await this._loading.present();

    if (this.QueryParams?.SelectedAttachment !== undefined && this.QueryParams?.SelectedAttachment !== null) {
      console.log("SelectedAttachment", this.QueryParams.SelectedAttachment);
      this.IsMetattachment = true;
    }
    let focusType: string = "";

    if (!this.IsMetattachment) {
      focusType = this.ActiveItem.Type;
    } else {
      switch (this.QueryParams.SelectedAttachment.EntityType) {
        case "Upc":
          focusType = "UPCs";
          break;
        case "Google Shopping":
          focusType = "Google Shopping Products";
          break;
        case "Google Web":
          focusType = "Google Web Links";
          break;
        case "Amazon":
          focusType = "Amazon Products";
          break;
        case "YouTube":
          focusType = "YouTube Videos";
          break;
        case "DigiDoc":
        case "Pics & Files":
          focusType = "Pics & Files";
          break;
        case "Qr Code":
          focusType = "Qr Codes";
          break;
        case "Bookmark":
          focusType = "Bookmarks";
          break;
      }
    }

    let entityId: number = 0;

    if (!this.IsMetattachment) {
      entityId = this.ActiveItem.Id;
    } else {
      entityId = this.QueryParams.SelectedAttachment.EntityId;
    }

    switch (focusType) {
      case "Google Shopping Products":
        this.itemService.getGoogleProduct(entityId).then(
          (x: IGoogleProductDto) => {
            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.GoogleProduct = x;
              activeItem.Image = x.Image;
              x.AssetInfo.Price = x.Price;
              activeItem.AssetInfo = x.AssetInfo;
              activeItem.IsMy = x.IsMy;
              activeItem.IsWishlist = x.IsWishlist;
              activeItem.IsSuggest = x.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              let activeAttachmentItem: ActiveItem = new ActiveItem();
              activeAttachmentItem.GoogleProduct = x;
              activeAttachmentItem.Id = x.Id;
              activeAttachmentItem.Type = focusType;
              activeAttachmentItem.Image = x.Image;
              activeAttachmentItem.AssetInfo = x.AssetInfo;

              this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
      case "Google Web Links":
        this.itemService.getGoogleLink(entityId).then(
          (x: IGoogleLinkDto) => {
            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.GoogleLink = x;
              activeItem.IsMy = x.IsMy;
              activeItem.IsWishlist = x.IsWishlist;
              activeItem.IsSuggest = x.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              let activeAttachmentItem: ActiveItem = new ActiveItem();
              activeAttachmentItem.Id = x.Id;
              activeAttachmentItem.Type = focusType;
              activeAttachmentItem.GoogleLink = x;
              this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
      case "Amazon Products":
        this.itemService.getAmazon(entityId).then(
          (x: IAmazonDto) => {
            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.Amazon = x;
              activeItem.Image = x.Image;
              activeItem.AssetInfo = x.AssetInfo;
              activeItem.AssetInfo.Description = x.Description;
              activeItem.IsMy = x.IsMy;
              activeItem.IsWishlist = x.IsWishlist;
              activeItem.IsSuggest = x.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              let activeAttachmentItem: ActiveItem = new ActiveItem();
              activeAttachmentItem.Amazon = x;
              activeAttachmentItem.Id = x.Id;
              activeAttachmentItem.Type = focusType;
              activeAttachmentItem.Image = x.Image;
              activeAttachmentItem.AssetInfo = x.AssetInfo;
              activeAttachmentItem.AssetInfo.Description = x.Description;
              this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
      case "YouTube Videos":
        this.itemService.getYouTube(entityId).then(
          (x: IYouTubeDto) => {
            this.videoUrl = this.sanitizerService.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${x.VideoID}`);

            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.YouTubeVideo = x;
              activeItem.IsMy = x.IsMy;
              activeItem.IsWishlist = x.IsWishlist;
              activeItem.IsSuggest = x.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              let activeAttachmentItem: ActiveItem = new ActiveItem();
              activeAttachmentItem.Id = x.Id;
              activeAttachmentItem.Type = focusType;
              activeAttachmentItem.YouTubeVideo = x;
              this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
      case "Pics & Files":
        if (this.ActiveItem.IsProfileItemImage) {
          this.profileItemImageService.getProfileItemImageAsync(entityId).then(
            (x: IDigiDocDto) => {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.Image = x.Url;
              let assetInfo = new AssetInfoDto();
              assetInfo.Description = x.Description;
              assetInfo.Title = x.Title;
              activeItem.AssetInfo = assetInfo;
              activeItem.IsMy = false;
              activeItem.IsWishlist = false;
              activeItem.IsSuggest = false;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;

              this._loading.dismiss();
            },
            (err) => {
              if (err.status == 401) {
                this._loading.dismiss();
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              }
            }
          );
        } else {
          this.itemService.getDigiDoc(entityId).then(
            (x: IDigiDocDto) => {
              if (!this.IsMetattachment) {
                let activeItem: ActiveItem = this.ActiveItem;
                activeItem.DigiDoc = x;
                activeItem.Image = x.Url;
                activeItem.AssetInfo = x.AssetInfo;
                activeItem.IsMy = x.IsMy;
                activeItem.IsWishlist = x.IsWishlist;
                activeItem.IsSuggest = x.IsSuggest;
                activeItem.ArtifactIndexId = x.ArtifactIndexId;
                this.ActiveItem = activeItem;
              } else {
                let activeAttachmentItem: ActiveItem = new ActiveItem();
                activeAttachmentItem.DigiDoc = x;
                activeAttachmentItem.Id = x.Id;
                activeAttachmentItem.Type = focusType;
                activeAttachmentItem.Image = x.Url;
                activeAttachmentItem.AssetInfo = x.AssetInfo;
                this.ActiveAttachmentItem = activeAttachmentItem;
              }
              console.log(this.ActiveItem);
              this._loading.dismiss();
            },
            (err) => {
              if (err.status == 401) {
                this._loading.dismiss();
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              }
            }
          );
        }
        break;
      case "UPCs":
        this.itemService.getUpcProduct(entityId).then(
          (x: IProductDto) => {
            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.Product = x;
              activeItem.Image = x.Image;
              activeItem.AssetInfo = x.AssetInfo;
              activeItem.IsMy = x.IsMy;
              activeItem.IsWishlist = x.IsWishlist;
              activeItem.IsSuggest = x.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              let activeAttachmentItem: ActiveItem = new ActiveItem();
              activeAttachmentItem.Id = x.Id;
              activeAttachmentItem.Product = x;
              activeAttachmentItem.Image = x.Image;
              activeAttachmentItem.AssetInfo = x.AssetInfo;
              activeAttachmentItem.Type = focusType;
              this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
      case "Qr Codes":
        this.itemService.getQrCode(entityId).then(
          (x: IQrCodeDto) => {
            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.QrCode = x;
              activeItem.AssetInfo = x.AssetInfo;
              activeItem.IsMy = x.IsMy;
              activeItem.IsWishlist = x.IsWishlist;
              activeItem.IsSuggest = x.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              let activeAttachmentItem: ActiveItem = new ActiveItem();
              activeAttachmentItem.Id = x.Id;
              activeAttachmentItem.Type = focusType;
              activeAttachmentItem.QrCode = x;
              activeAttachmentItem.AssetInfo = x.AssetInfo;
              this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
      case "Bookmarks":
        this.itemService.getBookmark(entityId).then(
          (x: BookmarkDto) => {
            if (!this.IsMetattachment) {
              let activeItem: ActiveItem = this.ActiveItem;
              activeItem.Bookmark = x;
              activeItem.AssetInfo = x.AssetInfo;
              activeItem.IsMy = x.Index.IsMy;
              activeItem.IsWishlist = x.Index.IsWishlist;
              activeItem.IsSuggest = x.Index.IsSuggest;
              activeItem.ArtifactIndexId = x.ArtifactIndexId;
              this.ActiveItem = activeItem;
            } else {
              //let activeAttachmentItem: ActiveItem = new ActiveItem();
              //activeAttachmentItem.Id = x.Id;
              //activeAttachmentItem.Type = this.focusType;
              //activeAttachmentItem.QrCode = x;
              //activeAttachmentItem.AssetInfo = x.AssetInfo;
              //this.ActiveAttachmentItem = activeAttachmentItem;
            }

            this._loading.dismiss();
          },
          (err) => {
            if (err.status == 401) {
              this._loading.dismiss();
              this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
              this.router.navigate(["sign-in"]);
            }
          }
        );
        break;
    }

    /* Get assigned tags context*/
    this.artifactIndexService.getArtifactIndexTag(this.ActiveItem.Id).then((result: Array<ITagContextDto>) => {
      this.selectedTagItems = this.createTagsModel(result);
    });
  }

  public handleResult() {}

  public edit() {
    this.router.navigate(["item-edit"]);
  }

  public clone() {
    let navExtras: NavigationExtras = {
      queryParams: { action: this._constants.Actions.clone },
    };

    this.router.navigate(["item-move-clone"], navExtras);
  }

  public move() {
    let navExtras: NavigationExtras = {
      queryParams: { action: this._constants.Actions.move },
    };

    this.router.navigate(["item-move-clone"], navExtras);
  }

  public async delete() {
    const alert = await this.alertCtrl.create({
      header: "Confirm",
      message: "Are you sure want to Delete?",
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
            this.startDelete();
          },
        },
      ],
    });
    await alert.present();
    return;
  }

  private async startDelete() {
    this._loading = await this.loadingCtrl.create({
      message: "deleting...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();

    let entityType: string = "";
    let entityId: number = 0;

    if (!this.IsMetattachment) {
      entityType = this.ActiveItem.Type;
      entityId = this.ActiveItem.Id;
    } else {
      entityType = this.ActiveAttachmentItem.Type;
      entityId = this.ActiveAttachmentItem.Id;
    }

    let itemDto: IItemDto = {} as IItemDto;
    itemDto.EntityType = entityType;
    itemDto.EntityId = entityId;
    itemDto.PropertyId = this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id;
    itemDto.ProxyPropertyId = this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0;
    itemDto.ProfileItemId = this.ProfileItem.Id === undefined ? 0 : this.ProfileItem.Id;
    itemDto.LineItemId = this.LineItem.Id;

    if (itemDto.ProfileItemId === 0) {
      this.itemService.deleteItemFromCategories(itemDto).then(
        () => {
          this.deleteSuccessHandler();
        },
        (err) => {
          this._loading.dismiss();
          if (err.status == 401) {
            this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
            this.router.navigate(["sign-in"]);
          } else {
            this._loading.dismiss();
            this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
          }
        }
      );
    } else {
      switch (entityType) {
        case "Google Shopping":
          this.itemService.deleteGoogleProduct(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
        case "Google Web":
          this.itemService.deleteGoogleLink(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
        case "Amazon":
          this.itemService.deleteAmazon(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
        case "YouTube":
          this.itemService.deleteYouTube(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
        case "Pics & Files":
          if (this.ActiveItem.IsProfileItemImage) {
            this.profileItemImageService
              .deleteProfileItemImageAsync(entityId, 0, [])
              .then((x) => {
                let profileItemImages: Array<IProfileItemImageDto> = this.ProfileItemImages as Array<IProfileItemImageDto>;
                const index: number = profileItemImages.findIndex((x) => x.Id == entityId);
                const filteredProfileItemImages: Array<IProfileItemImageDto> = profileItemImages
                  .slice(0, index)
                  .concat(profileItemImages.slice(index + 1, profileItemImages.length));
                this.ProfileItemImages = filteredProfileItemImages;
                this.deleteSuccessHandler();
              })
              .catch((err) => {
                this._loading.dismiss();

                if (err.status == 401) {
                  this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                  this.router.navigate(["sign-in"]);
                } else {
                  this._loading.dismiss();
                  this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
                }
              });
          } else {
            this.itemService.deleteDigiDoc(entityId, this.ProfileItem.Id, this.UserTypes).then(
              () => {
                this.deleteSuccessHandler();
              },
              (err) => {
                this._loading.dismiss();

                if (err.status == 401) {
                  this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                  this.router.navigate(["sign-in"]);
                } else {
                  this._loading.dismiss();
                  this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
                }
              }
            );
          }

          break;
        case "Upc":
          this.itemService.deleteUpcProduct(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
        case "Qr Code":
          this.itemService.deleteQrCode(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
        case "Bookmark":
          this.itemService.deleteBookmark(entityId, this.ProfileItem.Id, this.UserTypes).then(
            () => {
              this.deleteSuccessHandler();
            },
            (err) => {
              this._loading.dismiss();
              if (err.status == 401) {
                this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
                this.router.navigate(["sign-in"]);
              } else {
                this._loading.dismiss();
                this.uxNotifierService.showToast("Item was not deleted!", this._constants.ToastColorBad);
              }
            }
          );
          break;
      }
    }
  }

  public attachments() {
    this.router.navigate(["attachments"]);
  }

  public async maintenance() {
    // get contact information
    await this.contactInformationService
      .getArtifactContactInformationAsync("digidoc", this.ActiveItem.Id)
      .then(async (x: IContactInformationDto) => {
        let contactInformationModal = await this.modalCtrl.create({
          component: ContactInformationModalPage,
          componentProps: { x: x },
          cssClass: "small-modal",
        });
        await contactInformationModal.present();
        await contactInformationModal.onDidDismiss().then((data: any) => {
          if (data.data != null && data.data != undefined) {
            console.log("data", data);
          }
        });
      })
      .catch((e) => {});
  }

  public viewOrEditAttachment() {
    this.router.navigate(["create-metattach"]);
  }

  public browse() {
    let link: string;

    if (this.IsMetattachment) {
      if (this.ActiveAttachmentItem.Type === "Qr Codes" || this.ActiveAttachmentItem.Type === "Qr Code") {
        link = this.ActiveAttachmentItem.QrCode.Url;
      } else if (this.ActiveAttachmentItem.Type == "Google Web Links") {
        link = this.ActiveAttachmentItem.GoogleLink.Link;
      } else if (this.ActiveAttachmentItem.Type == "Bookmarks") {
        link = this.ActiveAttachmentItem.Bookmark.Url;
      }
    } else {
      if (this.ActiveItem.Type === "Qr Codes" || this.ActiveItem.Type == "Qr Code") {
        link = this.ActiveItem.QrCode.Url;
      } else if (this.ActiveItem.Type === "Google Web" || this.ActiveItem.Type == "Google Web Links") {
        link = this.ActiveItem.GoogleLink.Link;
      } else if (this.ActiveItem.Type == "Bookmarks") {
        link = this.ActiveItem.Bookmark.Url;
      }
    }
    let iab = this.inAppBrowser.create(link, "_blank");
    let script: any;
    iab.executeScript(script);
  }

  private async deleteSuccessHandler() {
    // delete the attachment
    if (this.IsMetattachment) {
      await this.attachmentService.deleteAttachment(this.ActiveAttachment.Id).then(
        (x) => {},
        (err) => {
          this.uxNotifierService.showToast("Attachment was not deleted!", this._constants.ToastColorBad);
        }
      );
    }

    this.uxNotifierService.showToast("Item deleted!", this._constants.ToastColorGood);
    if (this._isDeleteItemFromCategories) {
      let that: any = this;
      setTimeout(function () {
        that._loading.dismiss();
        that.close();
      }, 3000);
    } else {
      this._loading.dismiss();
      this.close();
    }
  }

  public close() {
    if (this.IsMetattachment) {
      localStorage.removeItem("ActiveAttachment");
      localStorage.removeItem("ActiveAttachmentItem");
      this.router.navigate(["attachments"]);
      this.QueryParams = {};
    } else {
      localStorage.removeItem("ActiveItem");
      this.router.navigate(["items"]);
    }
  }

  viewProfileLineItems() {
    this.router.navigate(["profile-items"]);
  }

  viewLineItemItems() {
    this.router.navigate(["items"]);
  }

  async onTagItemAdded(data) {
    console.log("onTagItemAdded");
    console.log("item = ", data);

    this._loading = await this.loadingCtrl.create({
      message: "Saving tags details...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();
    let artifactIndexTagDto: ArtifactIndexTagDto = new ArtifactIndexTagDto();
    artifactIndexTagDto.ArtifactIndexId = this.ActiveItem.Id;
    artifactIndexTagDto.TagContextId = data.value;

    this.artifactIndexService.insertArtifactIndexTag(artifactIndexTagDto).then(
      (x: any) => {
        this._loading.dismiss();
      },
      (err) => {
        this._loading.dismiss();
        if (err.status == 401) {
          this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
          //this.navController.setRoot(SignInPage);
          this.router.navigate(["sign-in"]);
        } else {
          this.uxNotifierService.showToast("Error saving tag!", this._constants.ToastColorBad);
        }
      }
    );
  }

  async onTagItemRemoved(data) {
    console.log("onTagItemRemoved");
    console.log("item = ", data);

    this._loading = await this.loadingCtrl.create({
      message: "Deleting Tag...",
      cssClass: "my-loading-class",
    });
    await this._loading.present();
    let artifactIndexTagDto: ArtifactIndexTagDto = new ArtifactIndexTagDto();
    artifactIndexTagDto.ArtifactIndexId = this.ActiveItem.Id;
    artifactIndexTagDto.TagContextId = data.value;

    this.artifactIndexService.deleteArtifactIndexTag(artifactIndexTagDto).then(
      (x: any) => {
        this._loading.dismiss();
      },
      (err) => {
        this._loading.dismiss();
        if (err.status == 401) {
          this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
          //this.navController.setRoot(SignInPage);
          this.router.navigate(["sign-in"]);
        } else {
          this.uxNotifierService.showToast("Error deleting tag!", this._constants.ToastColorBad);
        }
      }
    );
  }

  createTagsModel(input: Array<ITagContextDto>) {
    let output = [];
    input.forEach((x) => {
      // if Tags > 0 -->
      if (x.Tags !== null && x.Tags?.length > 0) {
        // show parent > child tag (possibly making both clickable?)
        x.Tags.forEach((y) => {
          output.push({ display: x.Tag.Name + " " + y.Name, value: y.TagContextId });
        });
      } else {
        output.push({ display: x.Tag.Name, value: x.Tag.TagContextId });
      }
    });

    return output;
  }
}
