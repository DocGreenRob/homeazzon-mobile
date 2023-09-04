import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMetattachPage } from './create-metattach.page';

describe('CreateMetattachPage', () => {
  let component: CreateMetattachPage;
  let fixture: ComponentFixture<CreateMetattachPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMetattachPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMetattachPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
