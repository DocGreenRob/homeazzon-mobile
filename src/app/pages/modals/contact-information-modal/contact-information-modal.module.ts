import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactInformationModalPageRoutingModule } from './contact-information-modal-routing.module';

import { ContactInformationModalPage } from './contact-information-modal.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		ContactInformationModalPageRoutingModule
	],
	declarations: [ContactInformationModalPage]
})
export class ContactInformationModalPageModule { }
