import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesDeveloperPage } from './user-types-developer.page';

describe('UserTypesDeveloperPage', () => {
  let component: UserTypesDeveloperPage;
  let fixture: ComponentFixture<UserTypesDeveloperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesDeveloperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesDeveloperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
