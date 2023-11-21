import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationOptionsComponent } from './location-options.component';

describe('LocationOptionsComponent', () => {
  let component: LocationOptionsComponent;
  let fixture: ComponentFixture<LocationOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LocationOptionsComponent]
    });
    fixture = TestBed.createComponent(LocationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
