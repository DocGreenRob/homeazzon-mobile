import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileBathroomsPage } from './property-profile-bathrooms.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileBathroomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileBathroomsPageRoutingModule {}
