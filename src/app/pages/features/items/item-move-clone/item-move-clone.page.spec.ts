import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemMoveClonePage } from './item-move-clone.page';

describe('ItemMoveClonePage', () => {
  let component: ItemMoveClonePage;
  let fixture: ComponentFixture<ItemMoveClonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMoveClonePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMoveClonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
