import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscLanguageComponent } from './lsc-language.component';

describe('LscLanguageComponent', () => {
    let component: LscLanguageComponent;
    let fixture: ComponentFixture<LscLanguageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LscLanguageComponent]
        });
        fixture = TestBed.createComponent(LscLanguageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
