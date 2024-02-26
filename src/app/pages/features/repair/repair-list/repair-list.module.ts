import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RepairListPageRoutingModule } from './repair-list-routing.module';
import { RepairListComponent } from './repair-list.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepairListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RepairListComponent]
})
export class RepairListPageModule {}
