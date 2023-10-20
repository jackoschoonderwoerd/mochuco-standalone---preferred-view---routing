import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemQrLocalComponent } from './item-qr-local.component';

describe('ItemQrLocalComponent', () => {
  let component: ItemQrLocalComponent;
  let fixture: ComponentFixture<ItemQrLocalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemQrLocalComponent]
    });
    fixture = TestBed.createComponent(ItemQrLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
