import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Coordinates } from 'src/app/admin/shared/models/coordinates.model';
import * as fromRoot from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { ItemsService } from '../../../items.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import { StorageService } from 'src/app/admin/admin-services/storage.service';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

@Component({
    selector: 'app-item-coordinates',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './item-coordinates.component.html',
    styleUrls: ['./item-coordinates.component.scss']
})
export class ItemCoordinatesComponent implements OnInit {
    form: FormGroup;
    adminSelectedVenue: Venue;
    adminSelectedItem: Item;
    item$: Observable<DocumentData>;
    inputChanged: boolean = false;
    venueId: string;
    itemId: string

    constructor(
        private fb: FormBuilder,
        private store: Store<fromRoot.State>,
        private uiService: UiService,
        private firestoreSerice: FirestoreService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.getItem().then((item: Item) => {
            if (item.coordinates) {
                this.patchForm(item)
            }
        })
    }

    getItem() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
                if (venueId) {
                    this.venueId = venueId;
                    this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                        if (itemId) {
                            this.itemId = itemId;
                            const pathToItem = `venues/${venueId}/items/${itemId}`;
                            this.item$ = this.firestoreSerice.getDocument(pathToItem);
                            this.firestoreSerice.getDocument(pathToItem).subscribe((item: Item) => {
                                resolve(item)
                            })
                        }
                    })
                }
            })
        })
        return promise;
    }

    onInputKeyDown() {
        this.inputChanged = true
    }

    patchForm(item: Item) {
        this.form.patchValue({
            latitude: item.coordinates.latitude,
            longitude: item.coordinates.longitude
        })
    }

    initForm() {
        this.form = this.fb.group({
            latitude: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null, [Validators.required])
        })
    }

    onUpdateCoordinates() {
        const formValue = this.form.value
        console.log(formValue)
        const coordinates: Coordinates = {
            latitude: parseFloat(formValue.latitude),
            longitude: parseFloat(formValue.longitude)
        }
        console.log(coordinates)
        const pathToItem = `venues/${this.venueId}/items/${this.itemId}`;
        this.firestoreSerice.updateDocument(pathToItem, { coordinates: coordinates }).then((res: any) => {
            console.log(res);
            this.inputChanged = false;
        })

    }
}
