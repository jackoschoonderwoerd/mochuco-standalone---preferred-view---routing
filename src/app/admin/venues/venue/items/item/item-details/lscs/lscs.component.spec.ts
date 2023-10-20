import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscsComponent } from './lscs.component';

describe('LscsComponent', () => {
    let component: LscsComponent;
    let fixture: ComponentFixture<LscsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LscsComponent]
        });
        fixture = TestBed.createComponent(LscsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
