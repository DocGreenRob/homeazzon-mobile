import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseHomePage } from './choose-home.page';

describe('ChooseHomePage', () => {
  let component: ChooseHomePage;
  let fixture: ComponentFixture<ChooseHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
