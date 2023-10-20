import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { Item } from 'src/app/admin/shared/models/item.model';
import { ItemsService } from '../items.service';
import { Store } from '@ngrx/store';
import * as fromRoot from './../../../../../app.reducer';
import * as ADMIN from './../../../../store/admin.actions'
import { Observable, from } from 'rxjs';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { UiService } from 'src/app/admin/shared/ui.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreError } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../shared/confirm/confirm.component';

@Component({
    selector: 'app-item',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,],

    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    form: FormGroup;
    editmode: boolean = false;
    venueId: string;
    // items$: Observable<any>
    @Input() public item: Item
    constructor(
        private fb: FormBuilder,
        private itemsService: ItemsService,
        private store: Store<fromRoot.State>,
        private uiService: UiService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        // console.log(this.item)
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl('new item', [Validators.required])
        })
    }

    onCancel() {
        this.router.navigateByUrl('/admin/venue');
    }
    onItemDetails() {
        this.store.dispatch(new ADMIN.SetSelectedItem(this.item))
        this.router.navigateByUrl('/admin/item-details')
    }
    onDeleteItem() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'are you sure, this will permanently delete the selected item'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
                    if (selectedVenue) {
                        this.itemsService.deleteItem(selectedVenue.id, this.item.id)
                            .then((res: any) => {
                                this.uiService.openSnackbar('item deleted')
                            })
                            .catch((err: FirestoreError) => {
                                this.uiService.openSnackbar(`deleting item failed; ${err.message}`)
                            });

                    }
                })
            }
        })
        return;
    }
}
