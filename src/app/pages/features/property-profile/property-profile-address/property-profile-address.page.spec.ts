import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileAddressPage } from './property-profile-address.page';

describe('PropertyProfileAddressPage', () => {
  let component: PropertyProfileAddressPage;
  let fixture: ComponentFixture<PropertyProfileAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileAddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
