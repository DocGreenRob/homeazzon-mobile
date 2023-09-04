import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileInteriorAreasPageRoutingModule } from './property-profile-interior-areas-routing.module';

import { PropertyProfileInteriorAreasPage } from './property-profile-interior-areas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileInteriorAreasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfileInteriorAreasPage]
})
export class PropertyProfileInteriorAreasPageModule {}
