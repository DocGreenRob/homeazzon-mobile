import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileExteriorAreasPageRoutingModule } from './property-profile-exterior-areas-routing.module';

import { PropertyProfileExteriorAreasPage } from './property-profile-exterior-areas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileExteriorAreasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfileExteriorAreasPage]
})
export class PropertyProfileExteriorAreasPageModule {}
