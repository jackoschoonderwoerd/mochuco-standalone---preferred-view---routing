import { TestBed } from '@angular/core/testing';

import { LscsService } from './lscs.service';

describe('LscsService', () => {
    let service: LscsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LscsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
