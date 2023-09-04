import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemMoveClonePage } from './item-move-clone.page';

const routes: Routes = [
  {
    path: '',
    component: ItemMoveClonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemMoveClonePageRoutingModule {}
