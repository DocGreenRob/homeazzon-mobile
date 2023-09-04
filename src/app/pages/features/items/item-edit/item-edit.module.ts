import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemEditPageRoutingModule } from './item-edit-routing.module';

import { ItemEditPage } from './item-edit.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemEditPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ItemEditPage]
})
export class ItemEditPageModule {}
