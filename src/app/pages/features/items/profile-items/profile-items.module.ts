import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileItemsPageRoutingModule } from './profile-items-routing.module';

import { ProfileItemsPage } from './profile-items.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditCategoriesPageModule } from 'src/app/pages/modals/edit-categories/edit-categories.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileItemsPageRoutingModule,
        ComponentsModule,
        EditCategoriesPageModule
  ],
  declarations: [ProfileItemsPage]
})
export class ProfileItemsPageModule {}
