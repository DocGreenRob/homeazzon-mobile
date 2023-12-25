import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertySelectorPage } from './property-selector.page';

describe('PropertySelectorPage', () => {
  let component: PropertySelectorPage;
  let fixture: ComponentFixture<PropertySelectorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PropertySelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
