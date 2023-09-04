import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IconGridComponent } from './icon-grid.component';

describe('IconGridComponent', () => {
  let component: IconGridComponent;
  let fixture: ComponentFixture<IconGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconGridComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IconGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
