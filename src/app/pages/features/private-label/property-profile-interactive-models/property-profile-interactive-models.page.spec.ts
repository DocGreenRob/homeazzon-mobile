import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyProfileInteractiveModelsPage } from './property-profile-interactive-models.page';

describe('PropertyProfileInteractiveModelsPage', () => {
  let component: PropertyProfileInteractiveModelsPage;
  let fixture: ComponentFixture<PropertyProfileInteractiveModelsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyProfileInteractiveModelsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyProfileInteractiveModelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
