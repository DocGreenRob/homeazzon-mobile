import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyProfileGeneralInformationPage } from './property-profile-general-information.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyProfileGeneralInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyProfileGeneralInformationPageRoutingModule {}
