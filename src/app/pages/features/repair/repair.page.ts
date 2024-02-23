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
import { Filesystem, Directory } from '@capacitor/filesystem';


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
    } else {
      Camera.checkPermissions().then((permissionStatus) => {
        if (permissionStatus.camera === 'granted') {
          const options = {
            quality: 80,
            resultType: CameraResultType.Uri, // Use Uri for gallery selection
            source: CameraSource.Prompt, // Show prompt to select from camera or gallery
            correctOrientation: true,
            allowEditing: true,
            saveToGallery: false // Ensure images are not saved to the gallery
          };
  
          this.TempActiveItem.Images = [];
          Camera.getPhoto(options).then(async (photo: CameraPhoto) => {
            console.log('photo: ', photo);
            if (photo) {
              // Save the selected image to the app's filesystem
              const savedFile = await this.savePhoto(photo);
              console.log('savedFile: ', savedFile);
              if (savedFile) {
                console.log('this.TempActiveItem: ', this.TempActiveItem);
                this.showImage = true;
                // Add the URI of the saved image to the Images array
                this.TempActiveItem.Images.push(savedFile.uri);
                console.log('this.TempActiveItem.Images: ', this.TempActiveItem.Images);
             alert(this.TempActiveItem.Images)
              }
            }
          }).catch((error) => {
            console.log(error);
            let sourceParams = this.QueryParams.sourceParamsCamera;
            let componentName = this.QueryParams.sourceCamera;
            if (componentName == "ItemDetailsPage") {
              this.router.navigate(["item-details"]);
            } else {
              this.QueryParams = sourceParams;
              this.router.navigate([componentName]);
            }
          });
  
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
  
  async savePhoto(photo: CameraPhoto) {
    // Convert photo format to base64, then write the file to the data directory
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    // Get the new file's path, which will be the app's data directory
    return {
      filepath: fileName,
      uri: savedFile.uri
    };
  }
  
  async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

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
