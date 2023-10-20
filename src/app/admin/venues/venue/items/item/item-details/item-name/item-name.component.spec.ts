import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNameComponent } from './edit-name.component';

describe('ItemNameComponent', () => {
    let component: ItemNameComponent;
    let fixture: ComponentFixture<ItemNameComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ItemNameComponent]
        });
        fixture = TestBed.createComponent(ItemNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
