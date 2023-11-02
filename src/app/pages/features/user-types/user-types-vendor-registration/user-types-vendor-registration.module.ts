import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { UserTypesVendorRegistrationRoutingModule } from './user-types-vendor-registration-routing.module';
import { UserTypesVendorRegistrationComponent } from './user-types-vendor-registration.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypesVendorRegistrationRoutingModule
  ],
  declarations: [UserTypesVendorRegistrationComponent]
})
export class UserTypesVendorRegistrationPageModule {}
