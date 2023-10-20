import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscDetailsComponent } from './lsc-details.component';

describe('LscDetailsComponent', () => {
    let component: LscDetailsComponent;
    let fixture: ComponentFixture<LscDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LscDetailsComponent]
        });
        fixture = TestBed.createComponent(LscDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
