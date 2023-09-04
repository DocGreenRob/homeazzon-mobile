import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileInteractiveModelsPageRoutingModule } from './property-profile-interactive-models-routing.module';

import { PropertyProfileInteractiveModelsPage } from './property-profile-interactive-models.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileInteractiveModelsPageRoutingModule
  ],
  declarations: [PropertyProfileInteractiveModelsPage]
})
export class PropertyProfileInteractiveModelsPageModule {}
