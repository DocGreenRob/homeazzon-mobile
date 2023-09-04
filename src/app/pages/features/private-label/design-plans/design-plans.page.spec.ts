import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignPlansPage } from './design-plans.page';

describe('DesignPlansPage', () => {
  let component: DesignPlansPage;
  let fixture: ComponentFixture<DesignPlansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignPlansPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
