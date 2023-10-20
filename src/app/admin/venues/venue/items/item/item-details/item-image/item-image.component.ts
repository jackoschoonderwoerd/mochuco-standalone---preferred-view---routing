import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { ItemsService } from '../../../items.service';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseError } from '@angular/fire/app';
import { UiService } from 'src/app/admin/shared/ui.service';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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


    constructor(
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private uiService: UiService,
        private dialog: MatDialog

    ) { }

    ngOnInit(): void {
        this.getSelectedVenue()
            .then((selectedVenue: Venue) => {
                this.selectedVenue = { ...selectedVenue }
            })
            .then(() => {
                this.getSelectedItem().then((selectedItem: Item) => {
                    this.selectedItem = { ...selectedItem }
                    this.item$ = this.itemsService.getItemByItemId(this.selectedVenue.id, this.selectedItem.id)
                })
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    getSelectedVenue() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
                if (selectedVenue) {
                    resolve(selectedVenue);
                }
            })

        })
        return promise
    }
    getSelectedItem() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                if (selectedItem) {
                    resolve(selectedItem)
                }
            })

        })
        return promise
    }

    onItemImageInputChange(e) {
        this.isLoading = true;
        const file = e.target.files[0];
        this.itemsService.addItemImageToStorage(this.selectedVenue.id, this.selectedItem.id, file)
            .then((url: string) => {
                this.uiService.openSnackbar('image file stored');
                this.itemsService.updateItemImageUrl(this.selectedVenue.id, this.selectedItem.id, url)
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to store image file; ${err.message}`)
                this.isLoading = false;
            })
            .then((res: any) => {
                this.uiService.openSnackbar('item image url updated')
                this.isLoading = false;
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update item image url; ${err.message}`);
                this.isLoading = false;
            });
    }

    onDeleteItemImage() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'Are you sure? This will permanently remove the selected image'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.itemsService.deleteItemImageFileFromStorage(this.selectedVenue.id, this.selectedItem.id)
                    .then((res: any) => {
                        this.uiService.openSnackbar(`item image file removed from storage`);
                        this.itemsService.updateItemImageUrl(this.selectedVenue.id, this.selectedItem.id, null)
                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to remove item image file from storage; ${err.message}`)
                    })
                    .then((res: any) => {
                        this.uiService.openSnackbar('item image url updated')
                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to update item image url; ${err.message}`)
                    })
            }
        })
    }
}
