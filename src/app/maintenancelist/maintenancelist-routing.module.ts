import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenancelistPage } from './maintenancelist.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenancelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenancelistPageRoutingModule {}
