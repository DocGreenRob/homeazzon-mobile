import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesRenterPage } from './user-types-renter.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesRenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesRenterPageRoutingModule {}
