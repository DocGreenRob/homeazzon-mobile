import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesSelectorPage } from './user-types-selector.page';

describe('UserTypesSelectorPage', () => {
  let component: UserTypesSelectorPage;
  let fixture: ComponentFixture<UserTypesSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesSelectorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
