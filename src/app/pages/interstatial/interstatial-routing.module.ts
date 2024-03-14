import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterstatialPage } from './interstatial.page';

const routes: Routes = [
  {
    path: '',
    component: InterstatialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterstatialPageRoutingModule {}
