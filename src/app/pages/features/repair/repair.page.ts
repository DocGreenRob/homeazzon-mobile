import { Component } from "@angular/core";
import { ActiveItem } from "@app/models/ActiveItem";
import { BasePage } from "src/app/pages/base/base.page";
import { Camera, CameraResultType, CameraSource, PermissionStatus, Photo } from "@capacitor/camera";
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


@Component({
  selector: "app-repair",
  templateUrl: "./repair.page.html",
  styleUrls: ["./repair.page.scss"],
})
export class RepairPage extends BasePage {
  public showImage: boolean = false;
  public TempActiveItem: ActiveItem = new ActiveItem();
  public isIos: boolean = false;
  public date: string;
  public note: string;
  mydata= []
  constructor( public override platform: Platform,   public override navController: NavController,
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
    private modalController: ModalController){
    
    super(navController, null, communicator, menuController, platform, null, uxNotifierService, null, null, null, storageService);

    this.isIos = this.platform.is('ios');
  }
  override ngOnInit() {

  }


  ionViewDidEnter() {
    this.launchCamera();
  }

  public override launchCamera() {
    if (this.platform.is("mobileweb")) {
      this.showImage = false;
      this.TempActiveItem.Image = "assets/icon/Insert picture icon.svg";
      //this.TempActiveItem.Image = "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fsolid%2Fcamera.svg?alt=media&token=e0af850d-247e-41a0-84ff-e6faa5e815b6";
    } else {
      // const options: CameraOptions = {
      //   quality: 50,
      //   destinationType: this.camera.DestinationType.DATA_URL,
      //   encodingType: this.camera.EncodingType.JPEG,
      //   sourceType: this.camera.PictureSourceType.CAMERA,
      //   correctOrientation: true,
      //   allowEdit: false,
      // };

      // this.camera.getPicture(options).then(
      //   (imageData) => {
      //     this.showImage = true;
      //     this.TempActiveItem.Image = "data:image/jpeg;base64," + imageData;
      //   },
      //   (error) => {
      //     console.log(error);
      //     let sourceParams = this.QueryParams.sourceParamsCamera;
      //     let componentName = this.QueryParams.sourceCamera;
      //     if (componentName == "DashboardPage") {
      //       this.router.navigate(["dashboard"]);
      //     } else {
      //       this.QueryParams = sourceParams;
      //       this.router.navigate([componentName]);
      //     }
      //   }
      // );
      Camera.checkPermissions().then((permissionStatus) => {
        if (permissionStatus.camera === 'granted') {
          Camera.getPhoto({
            quality: 80,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
            correctOrientation: true,
            allowEditing: true
          })
            .then(
              (imageData: Photo) => {
                this.showImage = true;
                this.TempActiveItem.Image = imageData.dataUrl;
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
        } else {
          Camera.requestPermissions().then((permission) => {
            if (permission.camera === 'granted') {
              this.launchCamera()
            }
          })
        }
      })
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
              url:e.target.result,
              type: 'img'
            });
          } else if (file.type.indexOf("video") > -1) {
            this.mydata.push({
              url:e.target.result,
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

  continue(){
const repairItem = {
  videos: this.mydata,
  image: this.TempActiveItem?.Image,
  date: this.date,
  note: this.note
}
console.log("repairItem",repairItem);
  }

}
