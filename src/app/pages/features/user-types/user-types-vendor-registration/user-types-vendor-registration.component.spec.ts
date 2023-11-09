import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesVendorRegistrationComponent } from './user-types-vendor-registration.component';

describe('UserTypesVendorRegistrationComponent', () => {
  let component: UserTypesVendorRegistrationComponent;
  let fixture: ComponentFixture<UserTypesVendorRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesVendorRegistrationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesVendorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
