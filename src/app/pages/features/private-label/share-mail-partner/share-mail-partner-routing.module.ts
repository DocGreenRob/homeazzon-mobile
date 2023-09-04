import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareMailPartnerPage } from './share-mail-partner.page';

const routes: Routes = [
  {
    path: '',
    component: ShareMailPartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareMailPartnerPageRoutingModule {}
