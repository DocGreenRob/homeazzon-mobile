import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseLotPage } from './choose-lot.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseLotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseLotPageRoutingModule {}
