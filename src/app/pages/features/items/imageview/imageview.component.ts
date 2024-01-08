import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-item-image-modal',
  templateUrl: './imageview.component.html',
  styleUrls: ['./imageview.component.scss'],
})
export class ImageviewComponent  implements OnInit {
  @Input() imageSrc: string;
  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  dismiss() {
    this.modalController.dismiss();
  }

}
@NgModule({
  declarations: [ImageviewComponent],
  imports: [IonicModule], // Add IonicModule to the imports array
})
export class ItemImageModalModule {}
