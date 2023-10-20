import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsComponent } from './item-stats.component';

describe('ItemStatsComponent', () => {
  let component: ItemStatsComponent;
  let fixture: ComponentFixture<ItemStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemStatsComponent]
    });
    fixture = TestBed.createComponent(ItemStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
