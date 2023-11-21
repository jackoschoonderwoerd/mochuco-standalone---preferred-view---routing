import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    collectionGroup,
    doc,
    docData,
    deleteDoc,
    updateDoc,
    DocumentReference,
    setDoc,
    orderBy,
    query,
    where,
    DocumentData
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

import { VenueIdItemId } from '../admin/shared/models/venueIdItemId';
import { Item } from '../admin/shared/models/item.model';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as VISITOR from './store/visitor.actions';
import * as fromRoot from 'src/app/app.reducer';
import { LSC } from '../admin/shared/models/language-specific-content.model';
import { FirestoreService } from '../admin/admin-services/firestore.service';


@Injectable({
    providedIn: 'root'
})
export class VisitorService {

    constructor(
        private fireStore: Firestore,
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService
    ) { }

    // getMainPageItemId(venueId: string) {
    //     const pathToItems = `venues/${venueId}/items`;
    //     const promise = new Promise((resolve, reject) => {
    //         this.firestoreService.getCollection(pathToItems).subscribe((items: Item[]) => {
    //             const mainPageItemsArray = items.filter((item: Item) => {
    //                 return item.isMainPage
    //             })
    //             const mainPageItemId = mainPageItemsArray[0].id
    //             resolve(mainPageItemId);
    //         })
    //     })
    //     return promise
    // }

    // storeMainPageItemIdX(venueId: string) {
    //     // console.log('visitorservice 35: getMainPageItemId' + venueId)
    //     const path = `venues/${venueId}/items`;
    //     const itemsRef = collection(this.fireStore, path);
    // collectionData(itemsRef, { idField: 'id' }).pipe(map((items: Item[]) => {
    //     return items.filter((item) => item.isMainPage)
    // })).subscribe((items) => {

    //     if (items && items.length) {
    //         console.log(items)

    //         if (items) {
    //             // console.log(items[0])

    //             const mainPageItem = items[0]
    //             this.store.dispatch(new VISITOR.SetVisitorMainPageItemId(mainPageItem.id))
    //         } else {
    //             console.log('no item')
    //         }
    //     })
    // }

    // storeMainPageItemId(venueId: string) {
    //     // console.log('visitorservice 35: getMainPageItemId' + venueId)
    //     const path = `venues/${venueId}/items`;
    //     const itemsRef = collection(this.fireStore, path);
    //     collectionData(itemsRef, { idField: 'id' }).pipe(map((items: Item[]) => {
    //         return items.filter((item: Item) => item.isMainPage)
    //     })).subscribe((items: Item[]) => {
    //         if (items && items.length) {
    //             // console.log(items)
    //             if (items) {
    //                 const mainPageItem = items[0]
    //                 // console.log(mainPageItem.id)
    //                 this.store.dispatch(new VISITOR.SetVisitorMainPageItemId(mainPageItem.id))
    //             } else {
    //                 console.log('no item')
    //             }
    //         }
    //     })
    // }

    // storeVisitorSelectedVenueId(venueId: string) {
    //     this.store.dispatch(new VISITOR.SetVisitorVenueId(venueId))
    // }
    // storeVisitorSelectedItemId(itemId: string) {
    //     this.store.dispatch(new VISITOR.SetVisitorItemId(itemId));
    // }

}
