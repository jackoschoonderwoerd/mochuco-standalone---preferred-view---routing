import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as VISITOR from 'src/app/visitor/store/visitor.actions';
import * as fromRoot from 'src/app/app.reducer';
import * as NAVIGATION from 'src/app/navigation/store/navigation.actions';
import { ItemsService } from '../../venues/venue/items/items.service';
import { VenuesService } from '../../venues/venues.service';
import { Venue } from '../models/venue.model';
import { Item } from '../models/item.model';
import { Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { LscsService } from '../../venues/venue/items/item/item-details/lscs/lscs.service';
import { LSC } from '../models/language-specific-content.model';
import { VenueIdItemId } from '../models/venueIdItemId';
import { VisitorService } from 'src/app/visitor/visitor.service';
import { ScannerService } from 'src/app/visitor/scanner/scanner.service';

@Component({
    selector: 'app-tests',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './tests.component.html',
    styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

    venueIdAmsterdamseSchool = 'uLTo5hk32u67P47GzYU4'
    itemIdBlokZeeburgerDijk = '1620kIHFkRVK3Kalbk5I';
    itemIdAmsterdamseSchoolMainPage = '897jq4uUtTG6zoZR3yk0'
    storedata: any;
    adminstore$: Observable<DocumentData>

    constructor(
        private router: Router,
        private store: Store<fromRoot.State>,
        private venuesService: VenuesService,
        private itemsService: ItemsService,
        private lscsService: LscsService,
        private visitorService: VisitorService,
        private scannerService: ScannerService
    ) { }

    ngOnInit(): void {
        this.adminstore$ = this.store.select('admin')
        this.store.subscribe((storedata: any) => {
            this.storedata = storedata
        })
    }


    onBlokZeeburgerdijk() {
        this.lscsService.storeLsc(this.venueIdAmsterdamseSchool, this.itemIdBlokZeeburgerDijk)
        // this.visitorService.storeMainPageItemId(this.venueIdAmsterdamseSchool);
        this.scannerService.getMainPageItemId(this.venueIdAmsterdamseSchool).then((mainPageItemId: string) => {
            this.store.dispatch(new VISITOR.SetVisitorMainPageItemId(mainPageItemId))
        })
        this.store.dispatch(new VISITOR.SetVisitorVenueId(this.venueIdAmsterdamseSchool))
        // this.visitorService.storeVisitorSelectedVenueId(this.venueIdAmsterdamseSchool)
        this.store.dispatch(new VISITOR.SetVisitorItemId(this.itemIdBlokZeeburgerDijk))
        // this.visitorService.storeVisitorSelectedItemId(this.itemIdBlokZeeburgerDijk)


        this.routeToScanResult();
    }

    onAmsterdamseSchool() {

        this.routeToScanResult();
    }
    routeToScanResult() {
        this.router.navigateByUrl('scan-result');
    }
}
