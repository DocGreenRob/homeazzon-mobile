import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttachmentsPage } from './attachments.page';

describe('AttachmentsPage', () => {
  let component: AttachmentsPage;
  let fixture: ComponentFixture<AttachmentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
