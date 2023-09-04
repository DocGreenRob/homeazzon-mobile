import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignPlansPage } from './design-plans.page';

const routes: Routes = [
  {
    path: '',
    component: DesignPlansPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignPlansPageRoutingModule {}
