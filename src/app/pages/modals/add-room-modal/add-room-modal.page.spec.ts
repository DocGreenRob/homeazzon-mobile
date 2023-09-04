import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRoomModalPage } from './add-room-modal.page';

describe('AddRoomModalPage', () => {
  let component: AddRoomModalPage;
  let fixture: ComponentFixture<AddRoomModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoomModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
