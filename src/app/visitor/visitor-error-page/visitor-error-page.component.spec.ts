import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorErrorPageComponent } from './visitor-error-page.component';

describe('VisitorErrorPageComponent', () => {
  let component: VisitorErrorPageComponent;
  let fixture: ComponentFixture<VisitorErrorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VisitorErrorPageComponent]
    });
    fixture = TestBed.createComponent(VisitorErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
