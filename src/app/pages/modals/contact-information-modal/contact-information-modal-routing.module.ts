import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactInformationModalPage } from './contact-information-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ContactInformationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactInformationModalPageRoutingModule {}
