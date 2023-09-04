import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileExteriorAreasPage } from './property-profile-exterior-areas.page';

describe('PropertyProfileExteriorAreasPage', () => {
  let component: PropertyProfileExteriorAreasPage;
  let fixture: ComponentFixture<PropertyProfileExteriorAreasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileExteriorAreasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileExteriorAreasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
