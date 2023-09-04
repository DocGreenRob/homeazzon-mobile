import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesRealtorPage } from './user-types-realtor.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesRealtorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesRealtorPageRoutingModule {}
