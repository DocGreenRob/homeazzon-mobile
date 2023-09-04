import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLineItemPageRoutingModule } from './add-line-item-routing.module';

import { AddLineItemPage } from './add-line-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddLineItemPageRoutingModule
  ],
  declarations: [AddLineItemPage]
})
export class AddLineItemPageModule {}
