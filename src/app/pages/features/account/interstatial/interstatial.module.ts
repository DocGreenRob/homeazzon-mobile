import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterstatialPageRoutingModule } from './interstatial-routing.module';

import { InterstatialPage } from './interstatial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterstatialPageRoutingModule
  ],
  declarations: [InterstatialPage]
})
export class InterstatialPageModule {}
