import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareWithPartnerPage } from './share-with-partner.page';

const routes: Routes = [
  {
    path: '',
    component: ShareWithPartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareWithPartnerPageRoutingModule {}
