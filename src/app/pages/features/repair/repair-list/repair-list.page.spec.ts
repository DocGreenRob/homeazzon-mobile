import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RepairListComponent } from './repair-list.page';

describe('RepairListComponent', () => {
  let component: RepairListComponent;
  let fixture: ComponentFixture<RepairListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RepairListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
