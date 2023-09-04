import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesOwnerPage } from './user-types-owner.page';

describe('UserTypesOwnerPage', () => {
  let component: UserTypesOwnerPage;
  let fixture: ComponentFixture<UserTypesOwnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesOwnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
