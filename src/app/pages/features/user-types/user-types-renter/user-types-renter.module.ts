import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesRenterPageRoutingModule } from './user-types-renter-routing.module';

import { UserTypesRenterPage } from './user-types-renter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesRenterPageRoutingModule
  ],
  declarations: [UserTypesRenterPage]
})
export class UserTypesRenterPageModule {}
