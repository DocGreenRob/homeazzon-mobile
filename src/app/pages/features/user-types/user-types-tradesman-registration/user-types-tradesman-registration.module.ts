import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {TradesmanRegistrationPageRoutingModule} from './user-types-tradesman-registration-routing.module';
import { UserTypesTradesmanRegistrationComponent } from './user-types-tradesman-registration.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradesmanRegistrationPageRoutingModule
  ],
  declarations: [UserTypesTradesmanRegistrationComponent]
})
export class TradesmanRegistraionPageModule {}
