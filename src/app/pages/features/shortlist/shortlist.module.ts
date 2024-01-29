import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ComponentsModule } from 'src/app/components/components.module';
import { ShortlistsRoutingModule } from './shortlist-routing.module';
import { ShortlistsPage } from './shortlist.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShortlistsRoutingModule,
    ComponentsModule
  ],
  declarations: [ShortlistsPage]
})
export class ShortlistsModule {}
