import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleDesignPlanPage } from './single-design-plan.page';

describe('SingleDesignPlanPage', () => {
  let component: SingleDesignPlanPage;
  let fixture: ComponentFixture<SingleDesignPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDesignPlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleDesignPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
