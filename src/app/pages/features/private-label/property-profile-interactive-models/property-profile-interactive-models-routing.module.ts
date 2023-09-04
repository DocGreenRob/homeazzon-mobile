import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileInteractiveModelsPage } from './property-profile-interactive-models.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileInteractiveModelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileInteractiveModelsPageRoutingModule {}
