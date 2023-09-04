import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemAddPageRoutingModule } from './item-add-routing.module';

import { ItemAddPage } from './item-add.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ItemAddPageRoutingModule,
		ComponentsModule
	],
	declarations: [ItemAddPage]
})
export class ItemAddPageModule { }
