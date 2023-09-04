import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchResultDetailsPageRoutingModule } from './search-result-details-routing.module';

import { SearchResultDetailsPage } from './search-result-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultDetailsPageRoutingModule
  ],
  declarations: [SearchResultDetailsPage]
})
export class SearchResultDetailsPageModule {}
