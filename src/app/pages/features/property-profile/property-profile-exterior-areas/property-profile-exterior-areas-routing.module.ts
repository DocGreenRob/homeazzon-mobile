import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileExteriorAreasPage } from './property-profile-exterior-areas.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileExteriorAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileExteriorAreasPageRoutingModule {}
