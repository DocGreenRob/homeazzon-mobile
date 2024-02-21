import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenancelistPageRoutingModule } from './maintenancelist-routing.module';

import { MaintenancelistPage } from './maintenancelist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenancelistPageRoutingModule
  ],
  declarations: [MaintenancelistPage]
})
export class MaintenancelistPageModule {}
