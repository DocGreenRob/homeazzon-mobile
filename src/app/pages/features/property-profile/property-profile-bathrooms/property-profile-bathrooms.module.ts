import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileBathroomsPageRoutingModule } from './property-profile-bathrooms-routing.module';

import { PropertyProfileBathroomsPage } from './property-profile-bathrooms.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileBathroomsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfileBathroomsPage]
})
export class PropertyProfileBathroomsPageModule {}
