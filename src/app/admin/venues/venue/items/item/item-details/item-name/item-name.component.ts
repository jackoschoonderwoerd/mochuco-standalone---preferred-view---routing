import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ItemDetailsComponent } from '../item-details.component';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Item } from 'src/app/admin/shared/models/item.model';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ItemsService } from '../../../items.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import { take } from 'rxjs';

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

    selectedVenue: Venue;
    selectedItem: Item;
    item$: Observable<DocumentData>
    form: FormGroup;
    editmode: boolean = false;
    inputChanged: boolean = false;

    constructor(
        private fb: FormBuilder,
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private uiService: UiService,
        private router: Router
        // @Inject(MAT_DIALOG_DATA) private data: any,
        // private dialogRef: MatDialogRef<ItemNameComponent>
    ) { }

    ngOnInit(): void {

        this.initForm();

        this.getSelectedVenue()
            .then((selectedVenue: Venue) => {
                this.selectedVenue = { ...selectedVenue }
                return

            }).then(() => {
                this.getSelectedItem().then((selectedItem: Item) => {
                    this.selectedItem = { ...selectedItem }
                })
                return
            }).then(() => {
                this.item$ = this.itemsService.getItemByItemId(this.selectedVenue.id, this.selectedItem.id);
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    onInputChanged() {
        this.inputChanged = true;
    }

    getSelectedVenue() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
                if (selectedVenue) {

                    resolve(selectedVenue)
                }
            })
        })
        return promise;
    }

    getSelectedItem() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                if (selectedItem) {
                    this.editmode = true;
                    this.patchForm(selectedItem)
                    resolve(selectedItem)
                }
            })
        })
        return promise
    }


    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            isMainPage: new FormControl(false)
        })
    }
    patchForm(selectedItem) {
        console.log(selectedItem)
        this.form.patchValue({
            name: selectedItem.name,
            isMainPage: selectedItem.isMainPage
        })
    }
    onAddOrUpdateItemName() {
        if (this.editmode) {
            this.updateItemName();
        } else {
            this.addItem();
        }
    }
    updateItemName() {
        let name = this.form.value.name;
        name = name.toLowerCase()
        this.itemsService.updateItemName(this.selectedVenue.id, this.selectedItem.id, name)
            .then((res: any) => {
                this.uiService.openSnackbar('item name updated');
                const updatedItem: Item = {
                    id: this.selectedItem.id,
                    name: name
                }
                this.store.dispatch(new ADMIN.SetSelectedItem(updatedItem));
                this.inputChanged = false;
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update item name; ${err.message}`);
            })
    }
    addItem() {
        let name = this.form.value.name;
        name = name.toLowerCase();
        const isMainPage = this.form.value.isMainPage
        const newItem: Item = {
            name,
            isMainPage
        }
        this.itemsService.addItem(this.selectedVenue.id, newItem)
            .then((res: any) => {
                console.log(res)
                this.store.dispatch(new ADMIN.SetSelectedItem(null))
                this.uiService.openSnackbar('item added');
                this.inputChanged = false;
                this.router.navigateByUrl('/admin/venue')
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to add item; ${err.message}`)
            })
    }
}
