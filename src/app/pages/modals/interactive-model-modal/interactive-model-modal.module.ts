import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractiveModelModalPageRoutingModule } from './interactive-model-modal-routing.module';

import { InteractiveModelModalPage } from './interactive-model-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractiveModelModalPageRoutingModule
  ],
  declarations: [InteractiveModelModalPage]
})
export class InteractiveModelModalPageModule {}
