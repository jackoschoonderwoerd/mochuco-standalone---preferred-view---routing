import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../admin/admin-services/storage.service';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { DocumentData } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Coordinates } from 'src/app/admin/shared/models/coordinates.model';

@Component({
    selector: 'app-location-options',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './location-options.component.html',
    styleUrls: ['./location-options.component.scss']
})
export class LocationOptionsComponent implements OnInit {


    items$: Observable<DocumentData[]>

    constructor(
        private firestoreService: FirestoreService,
        private store: Store,
        private dialogRef: MatDialogRef<LocationOptionsComponent>
    ) { }

    ngOnInit(): void {

        this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {
            if (venueId) {
                const path = `venues/${venueId}/items`
                this.items$ = this.firestoreService.getCollection(path)
            }
        })
    }

    onVisitorLocation(name: string, coordinates: Coordinates) {

        const visitorBearings = {
            name,
            coordinates
        }
        // console.log(itemData.name, itemData.visitorCoordinates)
        this.dialogRef.close(visitorBearings)
    }
}
