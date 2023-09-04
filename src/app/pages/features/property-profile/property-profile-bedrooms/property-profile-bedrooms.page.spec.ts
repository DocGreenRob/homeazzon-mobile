import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileBedroomsPage } from './property-profile-bedrooms.page';

describe('PropertyProfileBedroomsPage', () => {
  let component: PropertyProfileBedroomsPage;
  let fixture: ComponentFixture<PropertyProfileBedroomsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileBedroomsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileBedroomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
