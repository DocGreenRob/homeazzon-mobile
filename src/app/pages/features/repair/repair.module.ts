import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepairPageRoutingModule } from './repair-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';
import { RepairPage } from './repair.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepairPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RepairPage]
})
export class RepairPageModule {}
