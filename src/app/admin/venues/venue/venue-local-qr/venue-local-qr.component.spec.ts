import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueLocalQrComponent } from './venue-local-qr.component';

describe('VenueLocalQrComponent', () => {
  let component: VenueLocalQrComponent;
  let fixture: ComponentFixture<VenueLocalQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VenueLocalQrComponent]
    });
    fixture = TestBed.createComponent(VenueLocalQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
