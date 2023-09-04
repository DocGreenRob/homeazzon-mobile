import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyProfileAddressPageRoutingModule } from './property-profile-address-routing.module';

import { PropertyProfileAddressPage } from './property-profile-address.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
	imports: [
		ComponentsModule,
		CommonModule,
		FormsModule,
		IonicModule,
		PropertyProfileAddressPageRoutingModule
	],
	declarations: [PropertyProfileAddressPage]
})
export class PropertyProfileAddressPageModule { }
