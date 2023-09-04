import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LotDetailsPageRoutingModule } from './lot-details-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LotDetailsPage } from './lot-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LotDetailsPageRoutingModule,
    PdfViewerModule
  ],
  declarations: [LotDetailsPage]
})
export class LotDetailsPageModule {}
