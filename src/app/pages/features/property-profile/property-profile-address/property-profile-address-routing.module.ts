import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileAddressPage } from './property-profile-address.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileAddressPageRoutingModule {}
