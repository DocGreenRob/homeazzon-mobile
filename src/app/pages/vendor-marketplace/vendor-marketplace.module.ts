import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MarketplacePageRoutingModule } from './vendor-marketplace-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { VendorMarketplacePage } from './vendor-marketplace.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplacePageRoutingModule,
    ComponentsModule
  ],
  declarations: [VendorMarketplacePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendoerMarketplacePageModule {}
