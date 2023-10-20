import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIsMainPageComponent } from './item-is-main-page.component';

describe('ItemIsMainPageComponent', () => {
  let component: ItemIsMainPageComponent;
  let fixture: ComponentFixture<ItemIsMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemIsMainPageComponent]
    });
    fixture = TestBed.createComponent(ItemIsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
