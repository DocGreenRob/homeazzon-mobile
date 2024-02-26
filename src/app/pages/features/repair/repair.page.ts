import { Component } from "@angular/core";
import { ActiveItem } from "@app/models/ActiveItem";
import { BasePage } from "src/app/pages/base/base.page";
import { Camera, CameraPhoto, CameraResultType, CameraSource, PermissionStatus, Photo } from "@capacitor/camera";
import { AlertController, LoadingController, MenuController, ModalController, NavController, Platform } from "@ionic/angular";
import { ProductsService } from "@app/services/products/products.service";
import { CommunicatorService } from "@app/services/communicator/communicator.service";
import { ItemService } from "@app/services/item/item.service";
import { FirebaseUploadService } from "@app/services/firebase-upload/firebase-upload.service";
import { BarcodeService } from "@app/services/barcode/barcode.service";
import { UxNotifierService } from "@app/services/uxNotifier/ux-notifier.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { ProfileItemImageService } from "@app/services/profile-item-image/profile-item-image.service";
import { ImageviewComponent } from "../items/imageview/imageview.component";
import { Location } from "@angular/common";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-repair",
  templateUrl: "./repair.page.html",
  styleUrls: ["./repair.page.scss"],
})
export class RepairPage extends BasePage {
  public TempActiveItem: ActiveItem = new ActiveItem();
  public isIos: boolean = false;
  public date: string;
  public note: string;
  mydata = []
  captureImages: any[] = [];
  constructor(public override platform: Platform, public override navController: NavController,
    private loadingCtrl: LoadingController,
    private itemService: ItemService,
    public override uxNotifierService: UxNotifierService,
    // private camera: Camera,
    private firebaseService: FirebaseUploadService,
    // private barcodeScanner: BarcodeScanner,
    private barcodeService: BarcodeService,
    private alertController: AlertController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    private productService: ProductsService,
    // private chooser: Chooser,
    public alertCtrl: AlertController,
    private profileItemImageService: ProfileItemImageService,
    private location: Location,
    public override router: Router,
    public override storageService: LocalStorageService,
    private modalController: ModalController) {

    super(navController, null, communicator, menuController, platform, null, uxNotifierService, null, null, null, storageService);

    this.isIos = this.platform.is('ios');
  }
  override ngOnInit() {
    this.captureImages = this.storageService.get('captureImages');
  }


  ionViewDidEnter() {
    this.launchCamera();
  }

  public override launchCamera() {
    if (this.platform.is("mobileweb")) {
      this.TempActiveItem.Image = "assets/icon/Insert picture icon.svg";
    } else {
      Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // Prompt user to choose from gallery or camera
        correctOrientation: true,
        allowEditing: true
      })
        .then(
          (imageData: Photo) => {
            this.TempActiveItem.Image = Capacitor.convertFileSrc(imageData.path);
            if (!this.captureImages) {
              this.captureImages = [];
            }
            this.captureImages.push({ image: this.TempActiveItem.Image });
            this.storageService.set('captureImages', this.captureImages);
          },
          (error) => {
            console.log(error);
            let sourceParams = this.QueryParams.sourceParamsCamera;
            let componentName = this.QueryParams.sourceCamera;
            if (componentName == "ItemDetailsPage") {
              this.router.navigate(["item-details"]);
            } else {
              this.QueryParams = sourceParams;
              this.router.navigate([componentName]);
            }
          }
        );
    }
  }

  public async openImageModal() {
    const modal = await this.modalController.create({
      component: ImageviewComponent,
      componentProps: {
        imageSrc: this.TempActiveItem?.Image,
      },
    });
    return await modal.present();
  }

  onSelectFile(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type.indexOf("image") > -1) {
            this.mydata.push({
              url: e.target.result,
              type: 'img'
            });
          } else if (file.type.indexOf("video") > -1) {
            this.mydata.push({
              url: e.target.result,
              type: 'video'
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  public close() {
    this.location.back();
  }

  continue() {
    const repairItem = {
      videos: this.mydata,
      image: this.TempActiveItem?.Image,
      date: this.date,
      note: this.note
    }
    console.log("repairItem", repairItem);
  }

}
