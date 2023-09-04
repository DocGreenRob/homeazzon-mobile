import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesSelectorPageRoutingModule } from './user-types-selector-routing.module';

import { UserTypesSelectorPage } from './user-types-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesSelectorPageRoutingModule
  ],
  declarations: [UserTypesSelectorPage]
})
export class UserTypesSelectorPageModule {}
