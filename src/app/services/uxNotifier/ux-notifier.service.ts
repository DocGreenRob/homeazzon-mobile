import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { AlertController, ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class UxNotifierService extends baseService {
  constructor(public override http: HttpClient, public alertController: AlertController, public toastController: ToastController) {
    super(http);
  }

  async presentSimpleAlert(message, title) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ["Ok"],
    });
    await alert.present();
  }

  async showToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      //showCloseButton: true,
      //closeButtonText: 'x',
      color: color,
      animated: true,
    });

    await toast.present();
  }
}
