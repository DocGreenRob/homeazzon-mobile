import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PropertyProfileImagesDetailsPageRoutingModule } from './property-profile-images-detail-routing.module';
import { PropertyProfileImagesDetailsPage } from './property-profile-images-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyProfileImagesDetailsPageRoutingModule
  ],
  declarations: [PropertyProfileImagesDetailsPage]
})
export class PropertyProfileImagesDetailPageModule { }
