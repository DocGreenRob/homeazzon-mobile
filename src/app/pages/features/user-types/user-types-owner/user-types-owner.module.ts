import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesOwnerPageRoutingModule } from './user-types-owner-routing.module';

import { UserTypesOwnerPage } from './user-types-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesOwnerPageRoutingModule
  ],
  declarations: [UserTypesOwnerPage]
})
export class UserTypesOwnerPageModule {}
