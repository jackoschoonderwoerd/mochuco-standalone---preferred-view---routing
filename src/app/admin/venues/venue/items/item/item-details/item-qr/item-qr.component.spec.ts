import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemQrComponent } from './item-qr.component';

describe('ItemQrComponent', () => {
  let component: ItemQrComponent;
  let fixture: ComponentFixture<ItemQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemQrComponent]
    });
    fixture = TestBed.createComponent(ItemQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
