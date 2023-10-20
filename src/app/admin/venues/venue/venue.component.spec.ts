import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVenueComponent } from './venue.component';

describe('AddVenueComponent', () => {
    let component: AddVenueComponent;
    let fixture: ComponentFixture<AddVenueComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AddVenueComponent]
        });
        fixture = TestBed.createComponent(AddVenueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
