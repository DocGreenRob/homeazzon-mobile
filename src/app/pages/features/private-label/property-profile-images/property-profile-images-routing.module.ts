import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileImagesPage } from './property-profile-images.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileImagesPageRoutingModule {}
