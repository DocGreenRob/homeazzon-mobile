import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesVendorPage } from './user-types-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesVendorPageRoutingModule {}
