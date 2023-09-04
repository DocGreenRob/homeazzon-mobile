import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineItemsPage } from './line-items.page';

describe('LineItemsPage', () => {
  let component: LineItemsPage;
  let fixture: ComponentFixture<LineItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineItemsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
