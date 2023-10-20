import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscPreviewComponent } from './lsc-preview.component';

describe('LscPreviewComponent', () => {
    let component: LscPreviewComponent;
    let fixture: ComponentFixture<LscPreviewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LscPreviewComponent]
        });
        fixture = TestBed.createComponent(LscPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
