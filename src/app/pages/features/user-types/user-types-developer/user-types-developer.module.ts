import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesDeveloperPageRoutingModule } from './user-types-developer-routing.module';

import { UserTypesDeveloperPage } from './user-types-developer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesDeveloperPageRoutingModule
  ],
  declarations: [UserTypesDeveloperPage]
})
export class UserTypesDeveloperPageModule {}
