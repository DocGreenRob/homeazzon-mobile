import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesDeveloperPage } from './user-types-developer.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesDeveloperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesDeveloperPageRoutingModule {}
