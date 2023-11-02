import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTypesTradesmanRegistrationComponent } from './user-types-tradesman-registration.component';

const routes: Routes = [
  {
    path: '',
    component: UserTypesTradesmanRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradesmanRegistrationPageRoutingModule {}
