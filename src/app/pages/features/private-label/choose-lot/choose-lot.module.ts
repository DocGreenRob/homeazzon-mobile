import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseLotPageRoutingModule } from './choose-lot-routing.module';

import { ChooseLotPage } from './choose-lot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseLotPageRoutingModule
  ],
  declarations: [ChooseLotPage]
})
export class ChooseLotPageModule {}
