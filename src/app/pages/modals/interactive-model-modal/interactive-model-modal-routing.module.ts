import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractiveModelModalPage } from './interactive-model-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InteractiveModelModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteractiveModelModalPageRoutingModule {}
