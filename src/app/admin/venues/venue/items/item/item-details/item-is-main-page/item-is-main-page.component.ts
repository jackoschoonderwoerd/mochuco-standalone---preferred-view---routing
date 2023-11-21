import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { Item } from 'src/app/admin/shared/models/item.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'


@Component({
    selector: 'app-item-is-main-page',
    standalone: true,
    imports: [CommonModule, MatCheckboxModule],
    templateUrl: './item-is-main-page.component.html',
    styleUrls: ['./item-is-main-page.component.scss']
})

export class ItemIsMainPageComponent implements OnInit {

    checkboxDisabled: boolean = false;
    venueId: string;
    itemId: string;
    item$: Observable<DocumentData>;
    editmode: boolean = false


    constructor(
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId;
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.editmode = true;
                        this.itemId = itemId;
                        const pathToItem = `venues/${venueId}/items/${itemId}`
                        this.item$ = this.firestoreService.getDocument(pathToItem)
                        this.handleCheckbox()
                    }
                })
            }
        })
    }
    private handleCheckbox() {
        this.checkForExistingMainPageItems()
            .then((mainPageExists: boolean) => {
                if (mainPageExists) {
                    this.checkboxDisabled = true;
                    this.isCurrentItemMainPageItem().then((status: boolean) => {
                        if (status) {
                            this.checkboxDisabled = false;
                        }
                    })

                } else {
                    this.checkboxDisabled = false;
                }
            })
    }


    onCheckboxChange(e) {
        console.log(e.checked)
        const status = e.checked;
        const pathToItem = `venues/${this.venueId}/items/${this.itemId}`
        this.firestoreService.updateDocument(pathToItem, { isMainPage: status })
            .then((res: any) => {
                console.log('mainPageStatus updated');
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to update mainPageStatus; ${err.message}`)
            })
    }

    private checkForExistingMainPageItems() {
        let mainPageItemsLength: number = 0
        const promise = new Promise((resolve, reject) => {
            const pathToItems = `venues/${this.venueId}/items`;
            this.firestoreService.getCollection(pathToItems).pipe(take(1)).subscribe((items: Item[]) => {
                console.log(items.length)
                items.forEach((item: Item) => {
                    console.log(item.isMainPage)
                    if (item.isMainPage === true) {
                        mainPageItemsLength = mainPageItemsLength + 1
                    }
                })
                console.log(mainPageItemsLength)
                if (mainPageItemsLength > 0) {

                    resolve(true)
                }
            })
        })
        return promise
    }

    private isCurrentItemMainPageItem() {
        const promise = new Promise((resolve, reject) => {
            this.item$.subscribe((item: Item) => {
                if (item) {
                    resolve(item.isMainPage)
                    // resolve(true)
                }
            })
        })
        return promise
    }
}
