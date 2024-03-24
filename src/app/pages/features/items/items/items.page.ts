import { Component, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { LoadingController, MenuController, ModalController, NavController, NavParams, Platform } from "@ionic/angular";
import { TagsFilterComponent } from "src/app/components/tags-filter/tags-filter.component";
import { IActiveItem } from "src/app/models/dto/interfaces/IActiveItem";
import { IDigiDocDto } from "src/app/models/dto/interfaces/IDigiDocDto";
import { IGrid } from "src/app/models/dto/interfaces/IGrid";
import { IGridList } from "src/app/models/dto/interfaces/IGridList";
import { IGridListItem } from "src/app/models/dto/interfaces/IGridListItem";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { IProductDto } from "src/app/models/dto/interfaces/IProductDto";
import { IQrCodeDto } from "src/app/models/dto/interfaces/IQrCodeDto";
import { ITupleResult } from "src/app/models/dto/interfaces/ITupleResult";
import { IViewResultDto } from "src/app/models/dto/interfaces/IViewResultDto";
import { SegmentItem } from "src/app/models/SegmentItem";
import { BasePage } from "src/app/pages/base/base.page";
import { CommunicatorService } from "src/app/services/communicator/communicator.service";
import { ItemService } from "src/app/services/item/item.service";
import { SearchService } from "src/app/services/search/search.service";
import { UserTypesService } from "src/app/services/user-types/user-types.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { ViewsService } from "src/app/services/Views/Views.service";
import { Dictionary, Entry } from "../../../../models/Dictionary";
import { IBookmarkDto } from "../../../../models/dto/interfaces/IBookmarkDto";
import { ITagContextDto } from "../../../../models/dto/interfaces/ITagContextDto";
import { ITagDto } from "../../../../models/dto/interfaces/ITagDto";
import { SavedProductSearchResultDto } from "../../../../models/dto/SavedProductSearchResultDto";
import { SavedSearchEngineSearchResultDto } from "../../../../models/dto/SavedSearchEngineSearchResultDto";
import { SavedYouTubeSearchResultDto } from "../../../../models/dto/SavedYouTubeSearchResultDto";
import { ActiveItem } from "../../../../models/ActiveItem";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-items",
  templateUrl: "./items.page.html",
  styleUrls: ["./items.page.scss"],
})
export class ItemsPage extends BasePage {
  public isIos: boolean = false;
  public data: IGrid;
  public manageView: any = "my";
  public dynamicManageView: any = "";
  public isHideSegments: boolean = false;
  public title: string = "Loading...";

  private _loading: any;
  private _myGrid: IGrid;
  private _wishlistGrid: IGrid;
  private _suggestGrid: IGrid;
  private _genericViewResultGrid: IGrid;
  private _tupleDictionary: Dictionary;
  private _digiDocGridListsTags: IGridList;
  private _isListView: boolean = false;
  isListView: boolean = false;
  private hasLoadedData: boolean = false;
  spinnerText: string = 'Loading...';
  loading1Visible: boolean = false;
  spinnerText2: string = 'Loading...';
  loading2Visible: boolean = false;
  spinnerText3: string = 'Loading...';
  loading3Visible: boolean = false;
  spinnerText4: string = 'Loading...';
  loading4Visible: boolean = false;
  spinnerText5: string = 'Loading...';
  loading5Visible: boolean = false;
  spinnerText6: string = 'Loading...';
  loading6Visible: boolean = false;
  spinnerText7: string = 'Loading...';
  loading7Visible: boolean = false;
  spinnerText8: string = 'Loading...';
  loading8Visible: boolean = false;
  spinnerText9: string = 'Loading...';
  loading9Visible: boolean = false;
  views: Array<SegmentItem> = [
    {
      name: "My Stuff",
      value: "my",
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

  constructor(public override navController: NavController,
    public override navParams: NavParams,
    private searchService: SearchService,
    public override uxNotifierService: UxNotifierService,
    private loadingCtrl: LoadingController,
    private itemService: ItemService,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override userTypesService: UserTypesService,
    public viewsProvider: ViewsService,
    public override router: Router,
    public override inAppBrowser: InAppBrowser,
    private ngzone: NgZone,
    private modalCtrl: ModalController,
    private location: Location,
    public override storageService: LocalStorageService) {
    super(navController, navParams, communicator, menuController, platform, router, uxNotifierService, userTypesService, null, inAppBrowser, storageService);

    this.storageService.delete("ActiveItem");

    this._tupleDictionary = new Dictionary();
    this._tupleDictionary.Entries = new Array<Entry>();

    this.isIos = this.platform.is('ios');

    if (this.User.IsPrivateLabelPartner) {
      this.segmentChanged('suggested');
      this.views = [
        {
          name: "Suggestions",
          value: "suggested"
        }
      ];
    }
  }

  override async ngOnInit() {
    console.log("ngOnInit ItemsPage");
  }

  public async ionViewDidEnter() {
    console.log("ionViewDidEnter ItemsPage");
    if (!this.hasLoadedData) {
    this._myGrid = { Lists: [] };
    this._wishlistGrid = { Lists: [] };
    this._suggestGrid = { Lists: [] };
    this._genericViewResultGrid = { Lists: [] };

    await this.start();
    this._isListView = false;

    this.User.IsPrivateLabelPartner ? this.segmentChanged('suggested') : this.segmentChanged('my');
    this.hasLoadedData = true;
    }
  }

  viewProfileLineItems() {
    this.router.navigate(["profile-items"]);
  }

  public itemClickEventHandler(gridList: IGridList) {
    let activeItem: ActiveItem = new ActiveItem();
    activeItem.Id = gridList.Items[0].Id;
    activeItem.Name = gridList.Items[0].Name;
    activeItem.Type = gridList.Name;
    activeItem.IsUnopenedSuggestion = gridList.Items[0]?.IsUnopenedSuggestion;

    if (activeItem.Type === "Pics & Files") {
      let digiDoc: IDigiDocDto = {} as IDigiDocDto;
      digiDoc.ContentType = gridList.Items[0].ContentType;
      digiDoc.Url = gridList.Items[0].IconPath;

      activeItem.DigiDoc = digiDoc;
    }

    if (this.isHideSegments) {
      activeItem.IsProfileItemImage = true;
      activeItem.Type = "Pics & Files";
    }
    this.ActiveItem = activeItem;

    gridList.Items[0].IsUnopenedSuggestion = false; // reset this here...

    this.router.navigate(["item-details"]);
  }

  public lotClickEventHandler($event) {
    //this.navController.push(ItemDetailsPage);
    this.ionViewDidEnter();
  }

  private async errorHandler(error: any) {
    if (error.status == 401) {
      this.uxNotifierService.presentSimpleAlert("Your credentials expired, please login again.", "Error");
      //this.navController.setRoot(SigninPage);
      this.router.navigate(["sign-in"]);
    }
  }

  private async getDynamicViewResultsAsync(id: number = 0) {
    let viewSegment = this.LineItem.View.ViewSegments.filter((x) => x.Id == id);
    this._isListView = viewSegment[0].IsListView;

    this.dynamicManageView = `_${id}`;

    // 1. build view

    // 2.
    //this.LineItem.View.
    this.viewsProvider
      .getViewResultsAsync({
        ViewSegmentId: id,
        IsGetAll: this._isListView,
        PropertyId: this.ActiveProperty.IsProxy ? 0 : this.ActiveProperty.Id,
        ProxyPropertyId: this.ActiveProperty.IsProxy ? this.ActiveProperty.Id : 0,
      })
      .then(
        (viewResultDtoArray: Array<Array<IViewResultDto>>) => {
          // _genericViewResultGrid
          let genericGridList: IGridList = { Name: "???", Items: [], ViewResultItems: [] };

          if (!this._isListView) {
            viewResultDtoArray.forEach((row) => {
              // find the header
              row.forEach((col) => {
                genericGridList.ViewResultItems.push({
                  EntityName: col.EntityName,
                  Id: col.Id,
                  IsHeader: col.IsHeader,
                  Label: col.Label,
                  Type: col.Type,
                  Value: col.Value,
                });
              });
              this._genericViewResultGrid.Lists.push(genericGridList);
            });
          } else {
            // get all the parent rows
            let parentsAndChildren: any = [{}];
            let parents = viewResultDtoArray.filter((x) => x[0].ParentId == 0);
            parents.forEach((x) => {
              let children = viewResultDtoArray.filter((a) => a[0].ParentId == x[0].Id);

              parentsAndChildren.push({
                Parent: x,
                Children: children,
              });

              // parent
              x.forEach((z) => {
                genericGridList.ViewResultItems.push({
                  EntityName: z.EntityName,
                  Id: z.Id,
                  IsHeader: z.IsHeader,
                  Label: z.Label,
                  Type: z.Type,
                  Value: z.Value,
                });
              });

              // children
              let counter: number = 0;
              children.map((row) => {
                row.forEach((z) => {
                  genericGridList.ViewResultItems.push({
                    EntityName: z.EntityName,
                    Id: z.Id,
                    IsHeader: z.IsHeader,
                    Label: z.Label,
                    Type: z.Type,
                    Value: z.Value,
                  });
                });
                genericGridList.ViewResultItems.push({
                  EntityName: `END_OF_ROW_${counter}`,
                  Id: genericGridList.ViewResultItems[genericGridList.ViewResultItems.length - 1].Id,
                  IsHeader: false,
                  Label: "END_OF_ROW",
                  Type: "END_OF_ROW",
                  Value: "END_OF_ROW",
                });
                counter++;
              });
            });
            this._genericViewResultGrid.Lists.push(genericGridList);
          }

          this.data = this._genericViewResultGrid;
          this.dynamicManageView = id;
          console.log(this.data);
        },
        (err) => { }
      );
  }

  public async start() {
    // Default to "My List" segment
    this.IsMy = true;
    this.IsWishlist = false;
    this.IsSuggest = false;

    // show profile item images
    if (this.LineItem.Id == undefined) {
      const profileItemImages = this.storageService.get('ProfileItemImages');
      this.isHideSegments = true;
      let profileItemImagesGridList: IGridList = { Name: "", Items: [] };

      profileItemImages?.forEach((x) => {
        profileItemImagesGridList.Items.push({ Id: x.Id, Name: x.Title, IconPath: null, ImagePath: x.Url });
      });

      this._genericViewResultGrid.Lists.push(profileItemImagesGridList);
      this.data = this._genericViewResultGrid;
    } else {
      // Architectural
      if (this.LineItem.Name == "01.03 Architectural") {
        this.QueryParams = {
          IsArchitectural: true,
          PrivateLabelerId: this.User.PrivateLabelers[0]?.User.Id,
          SqFeet: this.ActiveProperty.SqFt,
          propertyName: this.ActiveProperty.Name, // DO NOT "Fix". TODO: Need to fix casing globally
        };
        this.router.navigate(["property-profile-details"]);
      } else {
        if (this.LineItem.IsView) {
          await this.getDynamicViewResultsAsync(this.LineItem.View.DefaultSegmentId);
          //await this.getDynamicViewResultsAsync();
        } else {
          let myCount: number = 0;
          let wishlistCount: number = 0;
          let suggestedCount: number = 0;

          let amazonGridListsMy: IGridList = { Name: "Amazon Products", Items: [] };
          let amazonGridListsWishlist: IGridList = { Name: "Amazon Products", Items: [] };
          let amazonGridListsSuggest: IGridList = { Name: "Amazon Products", Items: [] };
          let googleProductGridListsMy: IGridList = { Name: "Google Shopping Products", Items: [] };
          let googleProductGridListsWishlist: IGridList = { Name: "Google Shopping Products", Items: [] };
          let googleProductGridListsSuggest: IGridList = { Name: "Google Shopping Products", Items: [] };
          let googleWebGridListsMy: IGridList = { Name: "Google Web Links", Items: [] };
          let googleWebGridListsWishlist: IGridList = { Name: "Google Web Links", Items: [] };
          let googleWebGridListsSuggest: IGridList = { Name: "Google Web Links", Items: [] };
          let youTubeGridListsMy: IGridList = { Name: "YouTube Videos", Items: [] };
          let youTubeGridListsWishlist: IGridList = { Name: "YouTube Videos", Items: [] };
          let youTubeGridListsSuggest: IGridList = { Name: "YouTube Videos", Items: [] };
          let digiDocGridListsMy: IGridList = { Name: "Pics & Files", Items: [] };
          let digiDocGridListsWishlist: IGridList = { Name: "Pics & Files", Items: [] };
          let digiDocGridListsSuggest: IGridList = { Name: "Pics & Files", Items: [] };
          let digiDocGridListsTags: IGridList = { Name: "", Items: [] };
          let upcGridListsMy: IGridList = { Name: "UPCs", Items: [] };
          let upcGridListsWishlist: IGridList = { Name: "UPCs", Items: [] };
          let upcGridListsSuggest: IGridList = { Name: "UPCs", Items: [] };
          let qrCodeGridListsMy: IGridList = { Name: "Qr Codes", Items: [] };
          let qrCodeGridListsWishlist: IGridList = { Name: "Qr Codes", Items: [] };
          let qrCodeGridListsSuggest: IGridList = { Name: "Qr Codes", Items: [] };
          let bookmarkGridListsMy: IGridList = { Name: "Bookmarks", Items: [] };
          let bookmarkGridListsWishlist: IGridList = { Name: "Bookmarks", Items: [] };
          let bookmarkGridListsSuggest: IGridList = { Name: "Bookmarks", Items: [] };

          let profileItemId: number = 0;

          if (this.ProfileItem.Id !== undefined) {
            profileItemId = this.ProfileItem.Id;
          }

          // const loaders = [
          // await this.loadingCtrl.create({ message: "Getting Google Products...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting Amazon Products...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting Google Web Links...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting YouTube Videos...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting Digi Docs...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting UPCs...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting QRCodes...", cssClass: "my-loading-class" }),
          // await this.loadingCtrl.create({ message: "Getting Bookmarks...", cssClass: "my-loading-class" })
          // ];
          // loaders[0]?.dismiss;
          this.presentSpinnerGoogle('Getting Google Products...');

          // 1. Google Shopping
          await this.searchService.getSavedGoogleProductData(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: Array<SavedProductSearchResultDto>) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();
              this.dismissSpinnerGoogle();
              this.presentSpinnerAmazon('Getting Amazon Products...');

              x.map((result) => {
                if (result.IsMy) {
                  googleProductGridListsMy.Items.push({ Id: result.Id, Name: result.Name, IconPath: null, ImagePath: result.Image });
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  googleProductGridListsWishlist.Items.push({ Id: result.Id, Name: result.Name, IconPath: null, ImagePath: result.Image });
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  googleProductGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.Name,
                    IconPath: null,
                    ImagePath: result.Image,
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (googleProductGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(googleProductGridListsMy);
                this.segmentChanged('my');
              }
              if (googleProductGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(googleProductGridListsWishlist);
                this.segmentChanged('wishlist');
              }
              if (googleProductGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(googleProductGridListsSuggest);
                this.segmentChanged('suggested');
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();
              this.dismissSpinnerGoogle();
              this.presentSpinnerAmazon('Getting Amazon Products...');

              this.errorHandler(err);
            }
          );

          // 2. Amazon
          await this.searchService.getSavedAmazonData(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: Array<SavedProductSearchResultDto>) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerAmazon();
              this.presentSpinnerGoogleWeb('Getting Google Web Links...');

              x.map((result) => {
                if (result.IsMy) {
                  amazonGridListsMy.Items.push({ Id: result.Id, Name: result.Name, IconPath: null, ImagePath: result.Image });
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  amazonGridListsWishlist.Items.push({ Id: result.Id, Name: result.Name, IconPath: null, ImagePath: result.Image });
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  amazonGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.Name,
                    IconPath: null,
                    ImagePath: result.Image,
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (amazonGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(amazonGridListsMy);
                this.segmentChanged('my');
              }
              if (amazonGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(amazonGridListsWishlist);
              }
              if (amazonGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(amazonGridListsSuggest);
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerAmazon();
              this.presentSpinnerGoogleWeb('Getting Google Web Links...');

              this.errorHandler(err);
            }
          );

          // 3. Google Web
          await this.searchService.getSavedGoogleData(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: Array<SavedSearchEngineSearchResultDto>) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerGoogleWeb();
              this.presentSpinnerYoutube('Getting YouTube Videos...');

              x.map((result: SavedSearchEngineSearchResultDto) => {
                if (result.IsMy) {
                  googleWebGridListsMy.Items.push({ Id: result.Id, Name: result.Title, IconPath: null, ImagePath: null });
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  googleWebGridListsWishlist.Items.push({ Id: result.Id, Name: result.Title, IconPath: null, ImagePath: null });
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  googleWebGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.Title,
                    IconPath: null,
                    ImagePath: null,
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (googleWebGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(googleWebGridListsMy);
                this.segmentChanged('my');
              }
              if (googleWebGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(googleWebGridListsWishlist);
              }
              if (googleWebGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(googleWebGridListsSuggest);
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerGoogleWeb();
              this.presentSpinnerYoutube('Getting YouTube Videos...');

              this.errorHandler(err);
            }
          );

          // 4. YouTube
          await this.searchService.getSavedYouTubeData(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: Array<SavedYouTubeSearchResultDto>) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerYoutube();
              this.presentSpinnerDigi('Getting Digi Docs...');

              x.map((result: SavedYouTubeSearchResultDto) => {
                if (result.IsMy) {
                  youTubeGridListsMy.Items.push({ Id: result.Id, Name: result.Title, IconPath: null, ImagePath: result.ThumbnailImg });
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  youTubeGridListsWishlist.Items.push({ Id: result.Id, Name: result.Title, IconPath: null, ImagePath: result.ThumbnailImg });
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  youTubeGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.Title,
                    IconPath: null,
                    ImagePath: result.ThumbnailImg,
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (youTubeGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(youTubeGridListsMy);
                this.segmentChanged('my');
              }
              if (youTubeGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(youTubeGridListsWishlist);
              }
              if (youTubeGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(youTubeGridListsSuggest);
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();
              this.dismissSpinnerYoutube();
              this.presentSpinnerDigi('Getting Digi Docs...');

              this.errorHandler(err);
            }
          );

          // 5. DigiDoc
          await this.itemService.getDigiDocs(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: ITupleResult) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerDigi();
              this.presentSpinnerUCP('Getting UPCs...');

              let entry: Entry = new Entry();
              entry.ArtifactType = "DigiDoc";
              entry.Tuple = x;
              this._tupleDictionary.Entries.push(entry);

              let taggedArtifacts: Array<number> = new Array<number>();
              const tagContexts: Array<ITagContextDto> = x.Item2;

              tagContexts?.forEach((x) => {
                // if Tags > 0 -->
                if (x.Tags?.length > 0) {
                  // show parent > child tag (possibly making both clickable?)
                  x.Tags.forEach((y) => {
                    this.PopulateTaggedArtifacts(y, taggedArtifacts);
                  });
                } else {
                  this.PopulateTaggedArtifacts(x.Tag, taggedArtifacts);
                }
              });

              taggedArtifacts?.forEach((x) => {
                tagContexts.forEach((y) => {
                  if (y.Tags?.length > 0) {
                    const parentTag: string = y.Tag.Name;
                    y.Tags.forEach((z) => {
                      const tag: IGridListItem = {
                        Id: x,
                        Name: `${parentTag} > ${z.Name}`,
                        ArtifactId: z.ArtifactId,
                        ArtifactIds: z.ArtifactIds,
                      };
                      digiDocGridListsTags.Items.push(tag);
                    });
                  } else {
                    const tag: IGridListItem = {
                      Id: y.Tag.Id,
                      Name: y.Tag.Name,
                      ArtifactId: y.Tag.ArtifactId,
                      ArtifactIds: y.Tag.ArtifactIds,
                    };
                    digiDocGridListsTags.Items.push(tag);
                  }
                });
              });

              // get the artifacts
              x?.Item1?.map((result: IDigiDocDto) => {
                let iconUrl: string = null;
                if (result.ContentType === "application/pdf") {
                  iconUrl =
                    "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-pdf.svg?alt=media&token=ec5d1f8a-8393-4b64-9a5b-5cc75ee01660";
                } else if (
                  result.ContentType === "application/msword" ||
                  result.ContentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ) {
                  iconUrl =
                    "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-word.svg?alt=media&token=f2f34448-fefe-4cbe-bcc7-0e2fe9ae0ef2";
                } else if (
                  result.ContentType === "application/vnd.ms-excel" ||
                  result.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ) {
                  iconUrl =
                    "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-excel.svg?alt=media&token=853b9d8f-3040-4540-8e7a-a33da225e793";
                } else if (
                  result.ContentType === "application/vnd.ms-powerpoint" ||
                  result.ContentType == "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                ) {
                  iconUrl =
                    "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fregular%2Ffile-powerpoint.svg?alt=media&token=a603f641-db7d-408c-8622-ed0c628cbe7e";
                }

                if (result.IsMy) {
                  if (!this.IsInArray(result.Id, taggedArtifacts)) {
                    digiDocGridListsMy.Items.push({
                      Id: result.Id,
                      Name: result.AssetInfo.Title,
                      IconPath: iconUrl,
                      ImagePath: result.Url,
                      ContentType: result.ContentType,
                    });
                  }
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  if (!this.IsInArray(result.Id, taggedArtifacts)) {
                    digiDocGridListsWishlist.Items.push({
                      Id: result.Id,
                      Name: result.AssetInfo.Title,
                      IconPath: iconUrl,
                      ImagePath: result.Url,
                      ContentType: result.ContentType,
                    });
                  }
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  if (!this.IsInArray(result.Id, taggedArtifacts)) {
                    digiDocGridListsSuggest.Items.push({
                      Id: result.Id,
                      Name: result.AssetInfo.Title,
                      IconPath: iconUrl,
                      ImagePath: result.Url,
                      IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                      ContentType: result.ContentType,
                    });
                  }
                  suggestedCount += 1;
                }
              });

              // filter tags (put in correct list)
              const digiDocTagsMy: IGridList = { Name: "", Items: [] };
              const digiDocTagsWishlist: IGridList = { Name: "", Items: [] };
              const digiDocTagsSuggestions: IGridList = { Name: "", Items: [] };
              const tagIds: Array<number> = digiDocGridListsTags.Items.map((x) => x.ArtifactId);

              digiDocGridListsTags.Items.forEach((x) => {
                if (x.ArtifactIds !== undefined && x.ArtifactIds !== null && x.ArtifactIds.some((y) => y)) {
                  x.ArtifactIds.forEach((z) => {
                    tagIds.push(z);
                  });
                }
              });
              digiDocGridListsMy.Items.forEach((x) => {
                if (digiDocTagsMy.Items.some((x) => x.ArtifactId === x.Id)) {
                  //digiDocGridListsTags
                  // ??
                }
              });

              if (digiDocGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(digiDocGridListsMy);
                //this._myGrid.Lists.push(digiDocGridListsTags);
                this.segmentChanged('my');
              }

              if (digiDocGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(digiDocGridListsWishlist);
              }

              if (digiDocGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(digiDocGridListsSuggest);
              }

              //Set Property to use in filter UI
              this._digiDocGridListsTags = digiDocGridListsTags;
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerDigi();
              this.presentSpinnerUCP('Getting UPCs...');

              this.errorHandler(err);
            }
          );

          // 6. Upc
          await this.itemService.getUpcProducts(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: Array<IProductDto>) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerUCP();
              this.presentSpinnerQR('Getting QRCodes...');


              x.map((result: IProductDto) => {
                if (result.IsMy) {
                  upcGridListsMy.Items.push({ Id: result.Id, Name: result.AssetInfo.Title, IconPath: null, ImagePath: result.Image });
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  upcGridListsWishlist.Items.push({ Id: result.Id, Name: result.AssetInfo.Title, IconPath: null, ImagePath: result.Image });
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  upcGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.AssetInfo.Title,
                    IconPath: null,
                    ImagePath: result.Image,
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (upcGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(upcGridListsMy);
                this.segmentChanged('my');
              }
              if (upcGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(upcGridListsWishlist);
              }
              if (upcGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(upcGridListsSuggest);
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerUCP();
              this.presentSpinnerQR('Getting QRCodes...');

              this.errorHandler(err);
            }
          );

          // 7. QrCode
          await this.itemService.getQrCodes(this.ActiveProperty.Id, profileItemId, this.LineItem.Id, 0, this.ActiveProperty.IsProxy).then(
            (x: Array<IQrCodeDto>) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerQR();
              this.presentSpinnerBookmark('Getting Bookmarks...');

              x.map((result: IQrCodeDto) => {
                if (result.IsMy) {
                  qrCodeGridListsMy.Items.push({
                    Id: result.Id,
                    Name: result.Url,
                    IconPath: null,
                    ImagePath:
                      "https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fqrcode.svg?alt=media&token=d2f01c14-b5b7-4248-b666-0fcd6584c0a6",
                  });
                  myCount += 1;
                }
                if (result.IsWishlist) {
                  qrCodeGridListsWishlist.Items.push({
                    Id: result.Id,
                    Name: result.Url,
                    IconPath: null,
                    ImagePath:
                      "https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fqrcode.svg?alt=media&token=d2f01c14-b5b7-4248-b666-0fcd6584c0a6",
                  });
                  wishlistCount += 1;
                }
                if (result.IsSuggest) {
                  qrCodeGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.Url,
                    IconPath: null,
                    ImagePath:
                      "https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fqrcode.svg?alt=media&token=d2f01c14-b5b7-4248-b666-0fcd6584c0a6",
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (qrCodeGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(qrCodeGridListsMy);
                this.segmentChanged('my');
              }
              if (qrCodeGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(qrCodeGridListsWishlist);
              }
              if (qrCodeGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(qrCodeGridListsSuggest);
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();

              this.dismissSpinnerQR();
              this.presentSpinnerBookmark('Getting Bookmarks...');

              this.errorHandler(err);
            }
          );

          // 8. Bookmarks
          await this.itemService.getBookmarks(profileItemId, this.LineItem.Id).then(
            (x: any) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();


              this.dismissSpinnerBookmark();

              x.Item1.map((result: IBookmarkDto) => {
                if (result.Index.IsMy) {
                  bookmarkGridListsMy.Items.push({ Id: result.Id, Name: result.AssetInfo.Title, IconPath: null, ImagePath: null });
                  myCount += 1;
                }

                if (result.Index.IsWishlist) {
                  bookmarkGridListsWishlist.Items.push({ Id: result.Id, Name: result.AssetInfo.Title, IconPath: null, ImagePath: null });
                  wishlistCount += 1;
                }

                if (result.Index.IsSuggest) {
                  bookmarkGridListsSuggest.Items.push({
                    Id: result.Id,
                    Name: result.AssetInfo.Title,
                    IconPath: null,
                    ImagePath: null,
                    IsUnopenedSuggestion: result.IsUnopenedSuggestion,
                  });
                  suggestedCount += 1;
                }
              });

              if (bookmarkGridListsMy.Items.length > 0) {
                this._myGrid.Lists.push(bookmarkGridListsMy);
                this.segmentChanged('my');
              }
              if (bookmarkGridListsWishlist.Items.length > 0) {
                this._wishlistGrid.Lists.push(bookmarkGridListsWishlist);
              }
              if (bookmarkGridListsSuggest.Items.length > 0) {
                this._suggestGrid.Lists.push(bookmarkGridListsSuggest);
              }
            },
            (err) => {
              // loaders[0]?.dismiss();
              // loaders.splice(0, 1);
              // loaders[0]?.present();


              this.dismissSpinnerBookmark();
              this.errorHandler(err);
            }
          );
        }
      }
    }
  }

  public segmentChanged(event: any) {
    this.IsMy = false;
    this.IsWishlist = false;
    this.IsSuggest = false;

    this.ngzone.run(() => {
      switch (event.toLowerCase()) {
        case 'my':
          this.my();
          this.IsMy = true;
          break;
        case 'wishlist':
          this.wishlist();
          this.IsWishlist = true;
          break;
        case 'suggested':
          this.suggested();
          this.IsSuggest = true;
          break;
      }
    });
  }

  private my() {
    this.ngzone.run(() => {
      this.data = this._myGrid;
      //this.manageView = 'my';
      console.log("my", this.data);
    });
  }

  private wishlist() {
    this.ngzone.run(() => {
      this.data = this._wishlistGrid;
      //this.manageView = 'wishlist';
      console.log("wishlist", this.data);
    });
  }

  private suggested() {
    this.ngzone.run(() => {
      this.data = this._suggestGrid;
      //this.manageView = 'suggested';
      console.log("suggested", this.data);
    });
  }

  async dynamicTabClickHandler(id: number) {
    // this._loading = this.loadingCtrl.create({
    //   message: "getting results...",
    //   cssClass: "my-loading-class",
    // });
    // this._loading.present();
    this.presentSpinner('getting results...');

    this.data = { Lists: [] };
    this._genericViewResultGrid = { Lists: [] };
    await this.getDynamicViewResultsAsync(id).then(
      (x) => {
        // this._loading.dismiss();
        this.dismissSpinner();
      },
      (err) => { }
    );
  }

  public close() {
    this.ProfileItemImages = [];
    this.storageService.delete("ProfileItemImages");

    if (this.ProfileItem.Id !== undefined && this.ProfileItem.Id !== null && this.ProfileItem.Id !== 0) {
      this.QueryParams = {
        propertyName: this.ActiveProperty.StreetAddress1.substring(0, 4),
        profileItem: this.ProfileItem,
        profileName: this.ProfileItem.Name,
        propertyObject: this.ActiveProperty,
      };

      this.router.navigate(["profile-items"]);
    } else {
      this.LineItem = {} as ILineitemDto;
      this.router.navigate(["dashboard"]);
    }
  }

  private PopulateTaggedArtifacts(tag: ITagDto, taggedArtifacts: Array<number>) {
    if (tag.ArtifactIds?.length > 0) {
      tag.ArtifactIds.forEach((y) => {
        if (!this.IsInArray(y, taggedArtifacts)) {
          taggedArtifacts.push(y);
        }
      });
    } else {
      if (!this.IsInArray(tag.ArtifactId, taggedArtifacts)) {
        taggedArtifacts.push(tag.ArtifactId);
      }
    }
  }

  private IsInArray(value: any, array: Array<any>) {
    return array.some((x) => x == value);
  }

  public async showTagsFilter() {
    let filterModal = await this.modalCtrl.create({
      component: TagsFilterComponent,
      componentProps: { tagsList: this._digiDocGridListsTags },
    });
    await filterModal.present();
  }

  async presentSpinnerGoogle(text: string) {
    this.spinnerText = text;
    this.loading1Visible = true;
  }

  async dismissSpinnerGoogle() {
    this.loading1Visible = false;
    this.spinnerText = '';
  }

  async presentSpinnerAmazon(text: string) {
    this.spinnerText2 = text;
    this.loading2Visible = true;
  }

  async dismissSpinnerAmazon() {
    this.loading2Visible = false;
    this.spinnerText2 = '';
  }
  async presentSpinnerGoogleWeb(text: string) {
    this.spinnerText3 = text;
    this.loading3Visible = true;
  }

  async dismissSpinnerGoogleWeb() {
    this.loading3Visible = false;
    this.spinnerText3 = '';
  }
  async presentSpinnerYoutube(text: string) {
    this.spinnerText4 = text;
    this.loading4Visible = true;
  }

  async dismissSpinnerYoutube() {
    this.loading4Visible = false;
    this.spinnerText4 = '';
  }
  async presentSpinnerDigi(text: string) {
    this.spinnerText5 = text;
    this.loading5Visible = true;
  }

  async dismissSpinnerDigi() {
    this.loading5Visible = false;
    this.spinnerText5 = '';
  }
  async presentSpinnerUCP(text: string) {
    this.spinnerText6 = text;
    this.loading6Visible = true;
  }

  async dismissSpinnerUCP() {
    this.loading6Visible = false;
    this.spinnerText6 = '';
  }
  async presentSpinnerQR(text: string) {
    this.spinnerText7 = text;
    this.loading7Visible = true;
  }

  async dismissSpinnerQR() {
    this.loading7Visible = false;
    this.spinnerText7 = '';
  }

  async presentSpinnerBookmark(text: string) {
    this.spinnerText8 = text;
    this.loading8Visible = true;
  }

  async dismissSpinnerBookmark() {
    this.loading8Visible = false;
    this.spinnerText8 = '';
  }

  async presentSpinner(text: string) {
    this.spinnerText9 = text;
    this.loading9Visible = true;
  }

  async dismissSpinner() {
    this.loading9Visible = false;
    this.spinnerText9 = '';
  }
}
