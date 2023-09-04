import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileOverviewPage } from './property-profile-overview.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileOverviewPageRoutingModule {}
