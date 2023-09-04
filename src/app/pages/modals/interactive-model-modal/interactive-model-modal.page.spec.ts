import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InteractiveModelModalPage } from './interactive-model-modal.page';

describe('InteractiveModelModalPage', () => {
  let component: InteractiveModelModalPage;
  let fixture: ComponentFixture<InteractiveModelModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveModelModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveModelModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
