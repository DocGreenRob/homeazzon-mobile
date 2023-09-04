import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseDevelopmentPage } from './choose-development.page';

describe('ChooseDevelopmentPage', () => {
  let component: ChooseDevelopmentPage;
  let fixture: ComponentFixture<ChooseDevelopmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseDevelopmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDevelopmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
