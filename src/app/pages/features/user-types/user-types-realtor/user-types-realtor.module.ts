import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesRealtorPageRoutingModule } from './user-types-realtor-routing.module';

import { UserTypesRealtorPage } from './user-types-realtor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesRealtorPageRoutingModule
  ],
  declarations: [UserTypesRealtorPage]
})
export class UserTypesRealtorPageModule {}
