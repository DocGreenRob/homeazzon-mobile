import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareWithPartnerPageRoutingModule } from './share-with-partner-routing.module';

import { ShareWithPartnerPage } from './share-with-partner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareWithPartnerPageRoutingModule
  ],
  declarations: [ShareWithPartnerPage]
})
export class ShareWithPartnerPageModule {}
