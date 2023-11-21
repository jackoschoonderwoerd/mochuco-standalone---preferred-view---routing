import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Observable } from 'rxjs';
import { DocumentData, FirestoreError } from '@angular/fire/firestore';
import { ItemsService } from '../../../items.service';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseError } from '@angular/fire/app';
import { UiService } from 'src/app/admin/shared/ui.service';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageService } from 'src/app/admin/admin-services/storage.service';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { StorageError } from '@angular/fire/storage';
import { StoreService } from 'src/app/admin/admin-services/store.service';

@Component({
    selector: 'app-item-image',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        ConfirmComponent,
        MatProgressSpinnerModule
    ],
    templateUrl: './item-image.component.html',
    styleUrls: ['./item-image.component.scss']
})
export class ItemImageComponent implements OnInit {

    selectedVenue: Venue;
    selectedItem: Item;
    item$: Observable<DocumentData>
    editmode: boolean = false;
    isLoading: boolean = false;
    venueId: string;
    itemId: string


    constructor(
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private dialog: MatDialog,
        private storageService: StorageService,
        private firestoreService: FirestoreService,
        private storeService: StoreService

    ) { }

    ngOnInit(): void {
        this.getItem()


    }
    getItem() {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.itemId = itemId;
                        const pathToItem = `venues/${venueId}/items/${itemId}`
                        this.item$ = this.firestoreService.getDocument(pathToItem)
                    }
                })
            }
        })
    }



    onItemImageInputChange(e) {
        this.isLoading = true;

        const itemStoragePath = `venues/${this.venueId}/items/${this.itemId}/itemImage`
        const file = e.target.files[0];

        this.storageService.storeObject(itemStoragePath, file)
            .then((imageUrl: string) => {
                console.log(imageUrl);
                this.isLoading = false;
                const path = `venues/${this.venueId}/items/${this.itemId}/`
                this.firestoreService.updateDocument(path, { imageUrl: imageUrl })
                    .then((res) => {
                        console.log(res)
                    })
                    .catch((err: FirestoreError) => {
                        console.error(err)
                    })
            })
            .catch((err: StorageError) => {
                console.error(err)
            })
    }

    onDeleteItemImage() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'Are you sure? This will permanently remove the selected image'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {

                const path = `venues/${this.venueId}/items/${this.itemId}/itemImage`
                this.storageService.deleteObject(path)
                    .then((res: any) => {
                        console.log('image file removed from storage')
                        const path = `venues/${this.venueId}/items/${this.itemId}/`
                        return this.firestoreService.updateDocument(path, { imageUrl: null });
                    })
                    .catch((err: StorageError) => {
                        console.error(`failed to remove image file from DB; ${err.message}`)
                    })

            }
        })
    }
}
