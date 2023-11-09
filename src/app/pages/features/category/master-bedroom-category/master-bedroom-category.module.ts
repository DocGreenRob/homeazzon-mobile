import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterBedroomCategoryComponent } from './master-bedroom-category.component';
import { MasterBedroomCategoryPageRoutingModule } from './add-line-item-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MasterBedroomCategoryPageRoutingModule
  ],
  declarations: [MasterBedroomCategoryComponent]
})
export class MasterBedroomCategoryPageModule {}
