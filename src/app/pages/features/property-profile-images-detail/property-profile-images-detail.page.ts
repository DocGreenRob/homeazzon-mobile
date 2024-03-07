import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-property-profile-images-detail",
  templateUrl: "./property-profile-images-detail.page.html",
  styleUrls: ["./property-profile-images-detail.page.scss"],
})
export class PropertyProfileImagesDetailsPage  {
@Input() propertyImageDetail : any

  constructor(private modalController: ModalController){ }

  public close() {
    this.modalController.dismiss();
  }
  
}