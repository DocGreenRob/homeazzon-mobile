import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileGeneralInformationPageRoutingModule } from './property-profile-general-information-routing.module';

import { PropertyProfileGeneralInformationPage } from './property-profile-general-information.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileGeneralInformationPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyProfileGeneralInformationPage]
})
export class PropertyProfileGeneralInformationPageModule {}
