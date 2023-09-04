import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesTradesmanPageRoutingModule } from './user-types-tradesman-routing.module';

import { UserTypesTradesmanPage } from './user-types-tradesman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesTradesmanPageRoutingModule
  ],
  declarations: [UserTypesTradesmanPage]
})
export class UserTypesTradesmanPageModule {}
