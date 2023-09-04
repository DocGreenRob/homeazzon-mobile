import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesRealtorPage } from './user-types-realtor.page';

describe('UserTypesRealtorPage', () => {
  let component: UserTypesRealtorPage;
  let fixture: ComponentFixture<UserTypesRealtorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesRealtorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesRealtorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
