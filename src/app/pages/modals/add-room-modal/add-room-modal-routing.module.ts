import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRoomModalPage } from './add-room-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddRoomModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoomModalPageRoutingModule {}
