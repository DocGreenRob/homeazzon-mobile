import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertySelectorPage } from './property-selector.page';

const routes: Routes = [
  {
    path: '',
    component: PropertySelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertySelectorPageRoutingModule {}
