import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CongratulationsPageRoutingModule } from './congratulations-routing.module';

import { CongratulationsPage } from './congratulations.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CongratulationsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CongratulationsPage]
})
export class CongratulationsPageModule {}
