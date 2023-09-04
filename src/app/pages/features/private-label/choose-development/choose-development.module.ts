import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseDevelopmentPageRoutingModule } from './choose-development-routing.module';

import { ChooseDevelopmentPage } from './choose-development.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ChooseDevelopmentPageRoutingModule,
		ComponentsModule
	],
	declarations: [ChooseDevelopmentPage]
})
export class ChooseDevelopmentPageModule { }
