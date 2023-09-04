import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileItemsPage } from './profile-items.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileItemsPageRoutingModule {}
