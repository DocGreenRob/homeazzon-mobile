import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleDesignPlanPageRoutingModule } from './single-design-plan-routing.module';

import { SingleDesignPlanPage } from './single-design-plan.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SingleDesignPlanPageRoutingModule,
		ComponentsModule,
		PdfViewerModule
	],
	declarations: [SingleDesignPlanPage]
})
export class SingleDesignPlanPageModule { }
