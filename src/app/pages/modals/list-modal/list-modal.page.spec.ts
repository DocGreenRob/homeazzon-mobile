import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListModalPage } from './list-modal.page';

describe('ListModalPage', () => {
  let component: ListModalPage;
  let fixture: ComponentFixture<ListModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
