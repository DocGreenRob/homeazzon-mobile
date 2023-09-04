import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMetattachPage } from './create-metattach.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMetattachPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMetattachPageRoutingModule {}
