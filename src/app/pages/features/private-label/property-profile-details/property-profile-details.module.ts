import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileDetailsPageRoutingModule } from './property-profile-details-routing.module';

import { PropertyProfileDetailsPage } from './property-profile-details.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileDetailsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfileDetailsPage]
})
export class PropertyProfileDetailsPageModule {}
