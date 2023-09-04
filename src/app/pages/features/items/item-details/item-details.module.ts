import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ItemDetailsPageRoutingModule } from "./item-details-routing.module";

import { ItemDetailsPage } from "./item-details.page";
import { ComponentsModule } from "src/app/components/components.module";
import { TagInputModule } from "ngx-chips";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { PinchZoomModule } from "@mtnair/ngx-pinch-zoom";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemDetailsPageRoutingModule,
    ComponentsModule,
    TagInputModule,
    ReactiveFormsModule,
    PdfViewerModule,
    PinchZoomModule,
  ],
  declarations: [ItemDetailsPage],
})
export class ItemDetailsPageModule {}
