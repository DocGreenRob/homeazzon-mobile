import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesTradesmanPage } from './user-types-tradesman.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesTradesmanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesTradesmanPageRoutingModule {}
