import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesManagerPage } from './user-types-manager.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesManagerPageRoutingModule {}
