import { ComponentFixture, TestBed, async, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImageviewComponent } from './imageview.component';

describe('ImageviewComponent', () => {
  let component: ImageviewComponent;
  let fixture: ComponentFixture<ImageviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
