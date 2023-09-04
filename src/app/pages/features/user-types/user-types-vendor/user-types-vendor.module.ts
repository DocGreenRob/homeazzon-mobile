import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTypesVendorPageRoutingModule } from './user-types-vendor-routing.module';

import { UserTypesVendorPage } from './user-types-vendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesVendorPageRoutingModule
  ],
  declarations: [UserTypesVendorPage]
})
export class UserTypesVendorPageModule {}
