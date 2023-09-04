import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseLotPage } from './choose-lot.page';

describe('ChooseLotPage', () => {
  let component: ChooseLotPage;
  let fixture: ComponentFixture<ChooseLotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseLotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseLotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
