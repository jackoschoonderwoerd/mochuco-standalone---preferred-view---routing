import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCoordinatesComponent } from './item-coordinates.component';

describe('ItemCoordinatesComponent', () => {
  let component: ItemCoordinatesComponent;
  let fixture: ComponentFixture<ItemCoordinatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemCoordinatesComponent]
    });
    fixture = TestBed.createComponent(ItemCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
