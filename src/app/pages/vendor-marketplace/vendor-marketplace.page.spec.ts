import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {VendorMarketplacePage } from './vendor-marketplace.page';

describe('VendorMarketplacePage', () => {
  let component: VendorMarketplacePage;
  let fixture: ComponentFixture<VendorMarketplacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorMarketplacePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorMarketplacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
