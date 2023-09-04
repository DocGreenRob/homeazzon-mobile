import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTypesSelectorPage } from './user-types-selector.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypesSelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypesSelectorPageRoutingModule {}
