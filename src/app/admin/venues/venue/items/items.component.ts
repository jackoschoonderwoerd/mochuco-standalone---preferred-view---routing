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
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

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
        private itemsService: ItemsService,
        private firestoreService: FirestoreService) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                const path = `venues/${venueId}/items`;
                this.items$ = this.firestoreService.getCollection(path);
            }

        })
    }

    onAddItem() {
        // this.store.dispatch(new ADMIN.SetSelectedItem(null))
        this.store.dispatch(new ADMIN.SetAdminItemId(null));
        this.router.navigateByUrl('/admin/item-details');
    }
}
