import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddLineItemPage } from './add-line-item.page';

describe('AddLineItemPage', () => {
  let component: AddLineItemPage;
  let fixture: ComponentFixture<AddLineItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLineItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
