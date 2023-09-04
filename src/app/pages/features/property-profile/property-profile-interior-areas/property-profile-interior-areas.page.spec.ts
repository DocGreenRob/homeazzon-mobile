import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileInteriorAreasPage } from './property-profile-interior-areas.page';

describe('PropertyProfileInteriorAreasPage', () => {
  let component: PropertyProfileInteriorAreasPage;
  let fixture: ComponentFixture<PropertyProfileInteriorAreasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileInteriorAreasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileInteriorAreasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
