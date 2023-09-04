import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileGeneralInformationPage } from './property-profile-general-information.page';

describe('PropertyProfileGeneralInformationPage', () => {
  let component: PropertyProfileGeneralInformationPage;
  let fixture: ComponentFixture<PropertyProfileGeneralInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileGeneralInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileGeneralInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
