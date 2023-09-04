import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRoomModalPageRoutingModule } from './add-room-modal-routing.module';

import { AddRoomModalPage } from './add-room-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRoomModalPageRoutingModule
  ],
  declarations: [AddRoomModalPage]
})
export class AddRoomModalPageModule {}
