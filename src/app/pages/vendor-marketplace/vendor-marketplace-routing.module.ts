import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorMarketplacePage } from './vendor-marketplace.page';

const routes: Routes = [
  {
    path: '',
    component: VendorMarketplacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplacePageRoutingModule {}
