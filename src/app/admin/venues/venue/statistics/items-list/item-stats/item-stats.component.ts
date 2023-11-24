import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { StatisticsService } from '../../statistics.service';
import { VisitData } from 'src/app/admin/shared/models/visit-data';
import { Observable, map, take, tap, from } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { DocumentData } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-item-stats',
    standalone: true,
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './item-stats.component.html',
    styleUrls: ['./item-stats.component.scss']
})
export class ItemStatsComponent implements OnInit {

    // visitsDataArray: any;

    itemVisitsArray$: Observable<DocumentData>;
    item$: Observable<DocumentData>;
    spinnerActive: boolean = false;
    activeItem: boolean = false;

    constructor(
        private store: Store<fromRoot.State>,
        private statisticsService: StatisticsService,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getItemIdStatistics).subscribe((itemId: string) => {
            console.log(itemId)
            if (itemId) {
                this.activeItem = true;
                this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
                    if (venueId) {
                        this.spinnerActive = true;
                        const pathToItem = `venues/${venueId}/items/${itemId}`
                        this.item$ = this.firestoreService.getDocument(pathToItem)
                        const pathToIteVisitsArray = `venues/${venueId}/statistics/${itemId}`
                        this.itemVisitsArray$ = from(this.firestoreService.getDocument(pathToIteVisitsArray))
                        this.itemVisitsArray$.subscribe(() => {
                            this.spinnerActive = false;
                        })
                    }

                })
            }
        })
    }
    onDateChange(e) {
        console.log(e.value)
    }
}
