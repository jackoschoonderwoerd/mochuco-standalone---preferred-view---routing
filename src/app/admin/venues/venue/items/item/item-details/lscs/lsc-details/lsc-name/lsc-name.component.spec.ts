import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscNameComponent } from './lsc-name.component';

describe('LscNameComponent', () => {
    let component: LscNameComponent;
    let fixture: ComponentFixture<LscNameComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LscNameComponent]
        });
        fixture = TestBed.createComponent(LscNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
