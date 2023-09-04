import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemEditPage } from './item-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ItemEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemEditPageRoutingModule {}
