import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorLscLanguageComponent } from './visitor-select-language.component';

describe('VisitorLscLanguageComponent', () => {
    let component: VisitorLscLanguageComponent;
    let fixture: ComponentFixture<VisitorLscLanguageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [VisitorLscLanguageComponent]
        });
        fixture = TestBed.createComponent(VisitorLscLanguageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
