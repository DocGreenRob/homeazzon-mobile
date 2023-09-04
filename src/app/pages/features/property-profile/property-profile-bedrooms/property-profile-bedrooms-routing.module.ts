import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileBedroomsPage } from './property-profile-bedrooms.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileBedroomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileBedroomsPageRoutingModule {}
