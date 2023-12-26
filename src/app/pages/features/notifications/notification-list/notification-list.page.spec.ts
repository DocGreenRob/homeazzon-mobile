import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationListPage } from './notification-list.page';

describe('NotificationListPage', () => {
  let component: NotificationListPage;
  let fixture: ComponentFixture<NotificationListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NotificationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
