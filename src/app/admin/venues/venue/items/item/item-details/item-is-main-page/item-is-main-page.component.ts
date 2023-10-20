import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Item } from 'src/app/admin/shared/models/item.model';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { ItemsService } from '../../../items.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';


@Component({
    selector: 'app-item-is-main-page',
    standalone: true,
    imports: [CommonModule, MatCheckboxModule],
    templateUrl: './item-is-main-page.component.html',
    styleUrls: ['./item-is-main-page.component.scss']
})
export class ItemIsMainPageComponent implements OnInit {

    selectedVenue: Venue
    selectedItem: Item;
    selectedItem$: Observable<DocumentData>;
    checkboxDisabled: boolean = false;


    constructor(
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private uiService: UiService) { }

    ngOnInit(): void {
        this.selectedItem$ = this.store.select(fromRoot.getSelectedItem);
        this.disableCheckbox();

        this.getVenueFromStore()
            .then((selectedVenue: Venue) => {
                this.selectedVenue = selectedVenue
            })

        this.getItemFromStore()
            .then((selectedItem: Item) => {
                this.selectedItem = selectedItem
            });
    }

    getVenueFromStore() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
                if (selectedVenue) {
                    resolve(selectedVenue)
                }
            })
        })
        return promise
    }

    getItemFromStore() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                if (selectedItem) {
                    resolve(selectedItem)
                }
            })

        })
        return promise
    }

    disableCheckbox() {
        let mainPageIsTaken
        this.getVenueFromStore()
            .then((selectedVenue: Venue) => {
                return selectedVenue.id
            })
            .then((venueId: string) => {
                return this.checkForExistingMainPageItem(venueId)
            })
            .then((mainPageTaken: boolean) => {
                mainPageIsTaken = mainPageTaken
                return this.isCurrentItemMainPageItem()
            })
            .then((isMainPage) => {
                if (mainPageIsTaken && !isMainPage) {
                    this.checkboxDisabled = true
                }
            })
            .catch(err => {
                console.log(err);
            })
    }



    onCheckboxChange(e) {
        console.log(e.checked)
        const status = e.checked;
        this.itemsService.updateItemIsMainPage(this.selectedVenue.id, this.selectedItem.id, status)
            .then((res: any) => {
                this.uiService.openSnackbar('item main page status updated');
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update main page status; ${err.message}`);
            })
    }

    checkForExistingMainPageItem(venueId: string) {
        const mainPageItemArray: Item[] = []
        const promise = new Promise((resolve, reject) => {
            this.itemsService.getItems(this.selectedVenue.id).subscribe((items: Item[]) => {
                items.forEach((item: Item) => {
                    if (item.isMainPage) {
                        mainPageItemArray.push(item)
                    }
                })
                if (mainPageItemArray.length) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
        return promise
    }

    isCurrentItemMainPageItem() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                if (selectedItem && selectedItem.isMainPage) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
        return promise
    }
}
