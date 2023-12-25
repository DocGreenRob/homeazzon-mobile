import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertySelectorPageRoutingModule } from './property-selector-routing.module';

import { PropertySelectorPage } from './property-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertySelectorPageRoutingModule
  ],
  declarations: [PropertySelectorPage]
})
export class PropertySelectorPageModule {}
