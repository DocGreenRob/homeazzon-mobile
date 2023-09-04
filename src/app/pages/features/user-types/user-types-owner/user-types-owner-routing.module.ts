import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesOwnerPage } from './user-types-owner.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesOwnerPageRoutingModule {}
