import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileInteriorAreasPage } from './property-profile-interior-areas.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileInteriorAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileInteriorAreasPageRoutingModule {}
