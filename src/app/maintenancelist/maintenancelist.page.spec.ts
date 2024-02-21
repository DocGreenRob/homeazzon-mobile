import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenancelistPage } from './maintenancelist.page';

describe('MaintenancelistPage', () => {
  let component: MaintenancelistPage;
  let fixture: ComponentFixture<MaintenancelistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MaintenancelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
