import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListModalPage } from './list-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ListModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListModalPageRoutingModule {}
