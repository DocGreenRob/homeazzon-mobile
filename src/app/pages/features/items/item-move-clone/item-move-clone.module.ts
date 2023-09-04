import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemMoveClonePageRoutingModule } from './item-move-clone-routing.module';

import { ItemMoveClonePage } from './item-move-clone.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemMoveClonePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ItemMoveClonePage]
})
export class ItemMoveClonePageModule {}
