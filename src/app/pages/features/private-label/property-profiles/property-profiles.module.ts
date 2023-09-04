import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfilesPageRoutingModule } from './property-profiles-routing.module';

import { PropertyProfilesPage } from './property-profiles.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfilesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfilesPage]
})
export class PropertyProfilesPageModule {}
