import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-new-folder',
  templateUrl: './add-new-folder.component.html',
  styleUrls: ['./add-new-folder.component.scss'],
})
export class AddNewFolderComponent  implements OnInit {
  folderName: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  createFolder(){
    this.modalController.dismiss(this.folderName);
  }

  cancel(){
    this.modalController.dismiss();
  }
}
