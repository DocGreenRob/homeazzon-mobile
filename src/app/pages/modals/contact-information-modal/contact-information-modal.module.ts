import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactInformationModalPageRoutingModule } from './contact-information-modal-routing.module';
import { ContactInformationModalPage } from './contact-information-modal.page';
import { ComponentsModule } from "../../../components/components.module";
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		ContactInformationModalPageRoutingModule,
		ComponentsModule
	],
	declarations: [ContactInformationModalPage]
})
export class ContactInformationModalPageModule { }
