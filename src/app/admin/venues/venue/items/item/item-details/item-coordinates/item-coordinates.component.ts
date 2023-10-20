import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Coordinates, Item } from 'src/app/admin/shared/models/item.model';
import * as fromRoot from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { ItemsService } from '../../../items.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import * as ADMIN from 'src/app/admin/store/admin.actions';

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
    adminSelectedItem$: Observable<DocumentData>;
    inputChanged: boolean = false;

    constructor(
        private fb: FormBuilder,
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private uiService: UiService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.adminSelectedItem$ = this.store.select(fromRoot.getSelectedItem);
        this.getSelectedVenueFromStore();
        this.getSelectedItemFromStore();
    }


    onInputKeyDown() {
        this.inputChanged = true
    }

    getSelectedVenueFromStore() {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.adminSelectedVenue = selectedVenue
            }
        })
    }

    getSelectedItemFromStore() {
        this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
            if (selectedItem) {
                this.adminSelectedItem = selectedItem
                if (selectedItem.coordinates) {
                    this.patchForm();
                }
            }
        })
    }


    patchForm() {
        this.form.patchValue({
            latitude: this.adminSelectedItem.coordinates.latitude,
            longitude: this.adminSelectedItem.coordinates.longitude
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
        const coordinates: Coordinates = {
            latitude: parseFloat(formValue.latitude),
            longitude: parseFloat(formValue.longitude)
        }
        this.itemsService.updateItemCoordinates(
            this.adminSelectedVenue.id,
            this.adminSelectedItem.id,
            coordinates)
            .then((res: any) => {
                this.updateItemInStore();
                this.uiService.openSnackbar('coordinates updated');
                this.inputChanged = false;
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update coordinates; ${err.message}`)
            });

    }
    updateItemInStore() {
        this.itemsService.getItemByItemId(this.adminSelectedVenue.id, this.adminSelectedItem.id).subscribe((updatedItem: Item) => {
            this.store.dispatch(new ADMIN.SetSelectedItem(updatedItem))
        })
    }
}
