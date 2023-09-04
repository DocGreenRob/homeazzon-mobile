import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesManagerPageRoutingModule } from './user-types-manager-routing.module';

import { UserTypesManagerPage } from './user-types-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesManagerPageRoutingModule
  ],
  declarations: [UserTypesManagerPage]
})
export class UserTypesManagerPageModule {}
