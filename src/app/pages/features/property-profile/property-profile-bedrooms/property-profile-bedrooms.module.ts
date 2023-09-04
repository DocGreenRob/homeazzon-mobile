import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileBedroomsPageRoutingModule } from './property-profile-bedrooms-routing.module';

import { PropertyProfileBedroomsPage } from './property-profile-bedrooms.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileBedroomsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfileBedroomsPage]
})
export class PropertyProfileBedroomsPageModule {}
