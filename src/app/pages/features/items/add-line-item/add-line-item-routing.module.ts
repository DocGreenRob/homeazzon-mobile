import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLineItemPage } from './add-line-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddLineItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLineItemPageRoutingModule {}
