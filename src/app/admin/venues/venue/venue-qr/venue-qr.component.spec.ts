import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueQrComponent } from './venue-qr.component';

describe('VenueQrComponent', () => {
  let component: VenueQrComponent;
  let fixture: ComponentFixture<VenueQrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VenueQrComponent]
    });
    fixture = TestBed.createComponent(VenueQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
