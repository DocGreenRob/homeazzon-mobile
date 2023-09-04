import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareMailPartnerPageRoutingModule } from './share-mail-partner-routing.module';

import { ShareMailPartnerPage } from './share-mail-partner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareMailPartnerPageRoutingModule
  ],
  declarations: [ShareMailPartnerPage]
})
export class ShareMailPartnerPageModule {}
