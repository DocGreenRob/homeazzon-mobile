import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NavigationSubMenuComponent } from './navigation-sub-menu.component';

describe('NavigationSubMenuComponent', () => {
	let component: NavigationSubMenuComponent;
	let fixture: ComponentFixture<NavigationSubMenuComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NavigationSubMenuComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(NavigationSubMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
