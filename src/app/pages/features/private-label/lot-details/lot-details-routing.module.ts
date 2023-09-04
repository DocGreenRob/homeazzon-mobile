import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LotDetailsPage } from './lot-details.page';

const routes: Routes = [
  {
    path: '',
    component: LotDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LotDetailsPageRoutingModule {}
