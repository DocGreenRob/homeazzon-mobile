import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareWithPartnerPage } from './share-with-partner.page';

describe('ShareWithPartnerPage', () => {
  let component: ShareWithPartnerPage;
  let fixture: ComponentFixture<ShareWithPartnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareWithPartnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareWithPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
