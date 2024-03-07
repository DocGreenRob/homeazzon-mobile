import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyProfileImagesDetailsPage } from './property-profile-images-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileImagesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileImagesDetailsPageRoutingModule {}
