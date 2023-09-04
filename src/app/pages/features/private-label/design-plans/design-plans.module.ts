import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesignPlansPageRoutingModule } from './design-plans-routing.module';

import { DesignPlansPage } from './design-plans.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignPlansPageRoutingModule,
    ComponentsModule,
    PdfViewerModule
  ],
  declarations: [DesignPlansPage]
})
export class DesignPlansPageModule {}
