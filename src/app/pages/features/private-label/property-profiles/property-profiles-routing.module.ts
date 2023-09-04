import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfilesPage } from './property-profiles.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfilesPageRoutingModule {}
