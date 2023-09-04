import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseHomePageRoutingModule } from './choose-home-routing.module';

import { ChooseHomePage } from './choose-home.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseHomePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChooseHomePage]
})
export class ChooseHomePageModule {}
