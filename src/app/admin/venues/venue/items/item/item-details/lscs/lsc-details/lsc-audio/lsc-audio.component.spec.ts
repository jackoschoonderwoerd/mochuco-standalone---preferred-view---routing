import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAudioComponent } from './lsc-audio.component';

describe('SelectAudioComponent', () => {
    let component: SelectAudioComponent;
    let fixture: ComponentFixture<SelectAudioComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SelectAudioComponent]
        });
        fixture = TestBed.createComponent(SelectAudioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
