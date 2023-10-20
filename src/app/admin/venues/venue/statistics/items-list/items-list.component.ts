import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { ItemsService } from '../../items/items.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/admin/shared/models/item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemStatsComponent } from './item-stats/item-stats.component';
import * as STATISTICS from '../store/statistics.actions'
import { Router } from '@angular/router';

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
    selectedItemId: string;
    venue: Venue;


    constructor(
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.store.select(fromRoot.getSelectedVenue).subscribe((venue: Venue) => {
            if (venue) {
                this.venue = venue
                this.itemsService.getItems(venue.id).subscribe((items: Item[]) => {
                    this.items = items
                })
            }

        })
    }
    onGetStats(itemId: string) {
        this.selectedItemId = itemId

        this.store.dispatch(new STATISTICS.SetItemIdStatistics(itemId))
    }
    onBackTodetails() {
        this.router.navigateByUrl('/admin/venue')
    }
}
