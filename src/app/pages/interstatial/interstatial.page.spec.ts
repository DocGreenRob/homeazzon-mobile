import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterstatialPage } from './interstatial.page';

describe('InterstatialPage', () => {
  let component: InterstatialPage;
  let fixture: ComponentFixture<InterstatialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterstatialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterstatialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
