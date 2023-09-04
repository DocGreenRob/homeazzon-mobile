import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleDesignPlanPage } from './single-design-plan.page';

const routes: Routes = [
  {
    path: '',
    component: SingleDesignPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleDesignPlanPageRoutingModule {}
