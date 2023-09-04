import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseDevelopmentPage } from './choose-development.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseDevelopmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseDevelopmentPageRoutingModule {}
