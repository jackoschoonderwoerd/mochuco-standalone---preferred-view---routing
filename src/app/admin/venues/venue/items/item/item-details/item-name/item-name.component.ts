import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from 'src/app/admin/shared/models/item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import * as fromRoot from 'src/app/app.reducer'

@Component({
    selector: 'app-item-name',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,


    ],
    templateUrl: './item-name.component.html',
    styleUrls: ['./item-name.component.scss']
})
export class ItemNameComponent implements OnInit {

    item$: Observable<DocumentData>
    form: FormGroup;
    editmode: boolean = false;
    inputChanged: boolean = false;
    venueId: string;
    itemId: string;

    constructor(
        private fb: FormBuilder,
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.editmode = true
                        this.itemId = itemId
                        const pathToItem = `venues/${venueId}/items/${itemId}`
                        this.item$ = this.firestoreService.getDocument(pathToItem)
                        this.item$.subscribe((item: Item) => {
                            if (item) {
                                this.patchForm(item.name)
                            }
                        })
                    }
                })
            }
        })
    }

    onInputChanged() {
        this.inputChanged = true;
    }

    onAddItemOrUpdateItemName() {
        let name = this.form.value.name;
        name = name.toLowerCase();
        if (this.editmode) {
            this.updateItem(name)
        } else {
            this.addItem(name)
        }
    }

    private updateItem(name) {
        const pathToItem = `venues/${this.venueId}/items/${this.itemId}`
        this.firestoreService.updateDocument(pathToItem, name)
            .then((res: any) => {
                console.log(`item updated; ${res}`)
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to update item; ${err.message}`)
            });
    }
    private addItem(name) {
        const item: Item = { name }
        const pathToItems = `venues/${this.venueId}/items`
        this.firestoreService.addDoc(pathToItems, item)
            .then((docRef: DocumentReference) => {
                console.log(`item added; ${docRef.id}`)

                this.store.dispatch(new ADMIN.SetAdminItemId(docRef.id));
                this.inputChanged = false;

            })
            .catch((err: FirebaseError) => {
                console.log(`failed to add item; ${err.message}`)
            })
    }

    private initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
        })
    }
    private patchForm(itemName) {
        this.form.patchValue({
            name: itemName,
        })
    }
}
