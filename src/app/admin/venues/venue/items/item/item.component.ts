import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule,

} from '@angular/forms';
import { ConfirmComponent } from '../../../../shared/confirm/confirm.component';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { Item } from 'src/app/admin/shared/models/item.model';
import { ItemsService } from '../items.service';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscsService } from './item-details/lscs/lscs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/admin/admin-services/storage.service';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { UiService } from 'src/app/admin/shared/ui.service';
import { WarningComponent } from 'src/app/admin/shared/warning/warning.component';
import * as ADMIN from './../../../../store/admin.actions'
import * as fromRoot from './../../../../../app.reducer';

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
        private store: Store<fromRoot.State>,
        private router: Router,
        private dialog: MatDialog,
        private fireStoreService: FirestoreService
    ) { }

    ngOnInit(): void {
        // console.log(this.item)
        this.initForm();
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId
            }
        })

    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl('new item', [Validators.required])
        })
    }

    onCancel() {
        this.router.navigateByUrl('/admin/venue');
    }
    onItemDetails(itemId) {
        this.store.dispatch(new ADMIN.SetAdminItemId(itemId))
        this.router.navigateByUrl('/admin/item-details')
    }

    onDeleteItem(itemId: string) {

        const languagesPath = `venues/${this.venueId}/items/${itemId}/languages`;
        const itemPath = `venues/${this.venueId}/items/${itemId}`;
        this.fireStoreService.collectionData(languagesPath).pipe(take(1)).subscribe((languages: LSC[]) => {
            this.fireStoreService.getDocument(itemPath).pipe(take(1)).subscribe((item: Item) => {
                if (languages.length && item.imageUrl) {
                    this.warnItemNotEmpty('delete languages and image first');
                } else if (languages.length && !item.imageUrl) {
                    this.warnItemNotEmpty('delete languages first');
                } else if (!languages.length && item.imageUrl) {
                    this.warnItemNotEmpty('delete image first')
                } else {
                    const dialogRef = this.dialog.open(ConfirmComponent, {
                        data: {
                            message: 'Are you sure? This will permanently delete the item.'
                        }
                    })
                    dialogRef.afterClosed().subscribe((res: boolean) => {
                        if (res) {
                            const itemPath = `venues/${this.venueId}/items/${itemId}`
                            this.fireStoreService.deleteDocument(itemPath)
                                .then((res: any) => {
                                    console.log('item deleted')
                                })
                                .catch((err: FirebaseError) => {
                                    console.error(`failed to delete item; ${err.message}`)
                                })
                        }
                    })
                }
            })
        })
    }

    private warnItemNotEmpty(messageExtension) {
        let baseMessage: string = 'The item needs to be empty before it can be deleted; ';
        this.dialog.open(WarningComponent, {
            data: {
                message: `${baseMessage} ${messageExtension}`
            }
        });
    }
}
