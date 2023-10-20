import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { SplashPageRoutingModule } from './splash-routing.module';
import { SplashComponent } from './splash.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SplashPageRoutingModule,
  ],
  declarations: [SplashComponent],
  providers: [SafariViewController],
})
export class SplashPageModule {}
