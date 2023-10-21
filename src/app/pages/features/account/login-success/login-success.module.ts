import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { LoginSuccessPageRoutingModule } from './login-success-routing.module';
import { LoginSuccessComponent } from './login-success.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginSuccessPageRoutingModule,
  ],
  declarations: [LoginSuccessComponent],
  providers: [SafariViewController],
})
export class LoginSuccessPageModule {}
