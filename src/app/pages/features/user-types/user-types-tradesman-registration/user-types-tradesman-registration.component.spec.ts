import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesTradesmanRegistrationComponent } from './user-types-tradesman-registration.component';

describe('UserTypesTradesmanRegistrationComponent', () => {
  let component: UserTypesTradesmanRegistrationComponent;
  let fixture: ComponentFixture<UserTypesTradesmanRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesTradesmanRegistrationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesTradesmanRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
