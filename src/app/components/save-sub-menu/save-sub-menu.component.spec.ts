import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SaveSubMenuComponent } from './save-sub-menu.component';

describe('SaveSubMenuComponent', () => {
	let component: SaveSubMenuComponent;
	let fixture: ComponentFixture<SaveSubMenuComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SaveSubMenuComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(SaveSubMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
