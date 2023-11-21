import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { StatisticsService } from '../../statistics.service';
import { VisitData } from 'src/app/admin/shared/models/visit-data';
import { take } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-item-stats',
    standalone: true,
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './item-stats.component.html',
    styleUrls: ['./item-stats.component.scss']
})
export class ItemStatsComponent implements OnInit {

    visitsDataArray: any

    constructor(
        private store: Store<fromRoot.State>,
        private statisticsService: StatisticsService
    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getItemIdStatistics).subscribe((itemId: string) => {
            this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
                this.statisticsService.getVisitsArray(venueId, itemId).subscribe((visitsData: any) => {
                    if (visitsData) {
                        this.visitsDataArray = visitsData.visits
                    } else {
                        this.visitsDataArray = null
                    }
                })
            })
        })
        return
        this.store.select(fromRoot.getAdminItemId).subscribe((venueId: string) => {
            if (venueId) {
                this.store.select(fromRoot.getItemIdStatistics).subscribe((itemId: string) => {
                    if (itemId) {
                        console.log(itemId)
                        this.statisticsService.getVisitsArray(venueId, itemId).subscribe((visitsData: any) => {
                            if (visitsData) {
                                this.visitsDataArray = visitsData.visits
                            } else {
                                this.visitsDataArray = null
                            }
                        })
                    }
                })
            }
        })

    }
}
