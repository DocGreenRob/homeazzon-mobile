import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareMailPartnerPage } from './share-mail-partner.page';

describe('ShareMailPartnerPage', () => {
  let component: ShareMailPartnerPage;
  let fixture: ComponentFixture<ShareMailPartnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareMailPartnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareMailPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
