import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTypesVendorPage } from './user-types-vendor.page';

describe('UserTypesVendorPage', () => {
  let component: UserTypesVendorPage;
  let fixture: ComponentFixture<UserTypesVendorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypesVendorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTypesVendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
