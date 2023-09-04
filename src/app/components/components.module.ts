import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NavigationSubMenuComponent } from './navigation-sub-menu/navigation-sub-menu.component';
import { PrimaryMenuComponent } from './primary-menu/primary-menu.component';
import { IonicModule } from '@ionic/angular';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { IconGridComponent } from './icon-grid/icon-grid.component';
import { SaveSubMenuComponent } from './save-sub-menu/save-sub-menu.component';
import { TagsFilterComponent } from './tags-filter/tags-filter.component';
import { SegmentSelectorComponent } from './segment-selector/segment-selector.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';


@NgModule({
	declarations: [
		NavigationSubMenuComponent,
		PrimaryMenuComponent,
		TabMenuComponent,
		IconGridComponent,
		SaveSubMenuComponent,
		SegmentSelectorComponent,
		DocumentViewerComponent,
		TagsFilterComponent],
	imports: [CommonModule, IonicModule],
	exports: [
		NavigationSubMenuComponent,
		PrimaryMenuComponent,
		TabMenuComponent,
		IconGridComponent,
		SaveSubMenuComponent,
		TagsFilterComponent,
		DocumentViewerComponent,
		SegmentSelectorComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
