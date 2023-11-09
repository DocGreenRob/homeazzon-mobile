import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesVendorRegistrationComponent } from './user-types-vendor-registration.component';

const routes: Routes = [
  {
    path: '',
    component: UserTypesVendorRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesVendorRegistrationRoutingModule {}
