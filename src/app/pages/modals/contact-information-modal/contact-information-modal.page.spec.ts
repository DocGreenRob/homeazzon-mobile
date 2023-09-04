import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactInformationModalPage } from './contact-information-modal.page';

describe('ContactInformationModalPage', () => {
  let component: ContactInformationModalPage;
  let fixture: ComponentFixture<ContactInformationModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInformationModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactInformationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
