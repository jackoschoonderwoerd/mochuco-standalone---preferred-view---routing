import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { ItemsService } from '../../items/items.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/admin/shared/models/item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemStatsComponent } from './item-stats/item-stats.component';
import * as STATISTICS from '../store/statistics.actions'
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { DocumentData } from '@angular/fire/firestore';
import { VisitData } from 'src/app/admin/shared/models/visit-data';

@Component({
    selector: 'app-items-list',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, ItemStatsComponent],
    templateUrl: './items-list.component.html',
    styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {

    items$: Observable<Item[]>
    items: Item[];
    venue$: Observable<DocumentData>
    statistics$: Observable<DocumentData>;
    selectedItemId: string;


    constructor(
        private store: Store<fromRoot.State>,
        private router: Router,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {

        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                console.log(venueId)
                const pathToStatistics = `venues/${venueId}/statistics`;
                this.firestoreService.getCollection(pathToStatistics).subscribe((visitsData: VisitData[]) => {
                    console.log(visitsData)
                    this.statistics$ = this.firestoreService.getCollection(pathToStatistics)
                })

                const pathToItems = `venues/${venueId}/items`;
                this.firestoreService.getCollection(pathToItems).subscribe((items: Item[]) => {
                    // console.log(items)
                    this.items = items
                })
            }
        })
    }
    onGetItemStats(itemId: string) {
        this.selectedItemId = itemId
        this.store.dispatch(new STATISTICS.SetItemIdStatistics(itemId))
    }
    onBackTodetails() {
        this.router.navigateByUrl('/admin/venue')
    }
}
