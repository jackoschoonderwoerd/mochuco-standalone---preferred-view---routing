import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from './../../../../app.reducer';
import * as ADMIN from './../../../store/admin.actions';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { MatButtonModule } from '@angular/material/button';
import { ItemsService } from './items.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/admin/shared/models/item.model';
import { MatIconModule } from '@angular/material/icon';
import { ItemComponent } from './item/item.component';

@Component({
    selector: 'app-items',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, ItemComponent],
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

    venueId: string;
    items$: Observable<any[]>

    constructor(
        private router: Router,
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.items$ = this.itemsService.getItems(selectedVenue.id)
            }
        })
    }

    onEdit(item: Item) {
        console.log(item);
    }
    onDelete(itemId: string) {
        console.log(itemId);
    }

    onAddItem() {
        this.store.dispatch(new ADMIN.SetSelectedItem(null))
        this.router.navigateByUrl('/admin/item-details');
    }

}
