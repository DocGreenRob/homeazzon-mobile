import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileOverviewPage } from './property-profile-overview.page';

describe('PropertyProfileOverviewPage', () => {
  let component: PropertyProfileOverviewPage;
  let fixture: ComponentFixture<PropertyProfileOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
