import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileDetailsPage } from './property-profile-details.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileDetailsPageRoutingModule {}
