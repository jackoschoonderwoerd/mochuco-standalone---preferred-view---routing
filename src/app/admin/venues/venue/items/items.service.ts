import { Injectable } from '@angular/core';
import { Coordinates, Item } from 'src/app/admin/shared/models/item.model';
import {
    Storage,
    ref,
    deleteObject,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    getMetadata,
    provideStorage,
    getStorage,
    getBytes,
} from '@angular/fire/storage';
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
import { Observable } from 'rxjs';
import * as fromApp from './../../../../app.reducer';
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';


@Injectable({
    providedIn: 'root'
})
export class ItemsService {

    constructor(
        private firestore: Firestore,
        private store: Store<fromApp.State>,
        private storage: Storage
        // private itemsService: ItemsService
    ) { }

    addItem(venueId: string, item: Item) {
        const path = `venues/${venueId}/items`
        const itemRef = collection(this.firestore, path)
        return addDoc(itemRef, item)
    }


    getItems(venueId) {
        const path = `venues/${venueId}/items`
        const itemsRef = collection(this.firestore, path);
        const itemsQuery = query(itemsRef, orderBy('name'));
        return collectionData(itemsQuery, { idField: 'id' });
    }
    // getMochucoItem() {
    //     const path = `venues/${venueId}/items`
    // }

    getMainPageItem(venueId: string) {
        const path = `venues/${venueId}/items`;
        const itemsRef = collection(this.firestore, path);
        const isMainPageQuery = query(itemsRef, where('isMainPage', '==', true))
        return collectionData(isMainPageQuery, { idField: 'id' })
    }


    getItemByItemId(venueId: string, itemId: string) {
        const path = `venues/${venueId}/items/${itemId}`
        const itemRef = doc(this.firestore, path)
        return docData(itemRef, { idField: 'id' })
    }
    deleteItem(venueId: string, itemId: string) {
        // const promise = new Promise((res, rej) => {
        // this.store.select(fromApp.getSelectedVenue).subscribe((venue: Venue) => {
        const path = `venues/${venueId}/items/${itemId}`;
        const itemRef = doc(this.firestore, path);
        // res(deleteDoc(itemRef));
        return deleteDoc(itemRef)
        // })
        // })
        // return promise
    }
    updateItemName(venueId: string, itemId: string, name: string) {
        const path = `venues/${venueId}/items/${itemId}`;
        const itemRef = doc(this.firestore, path);
        return (updateDoc(itemRef, { name }))
    }

    updateItemIsMainPage(venueId: string, itemId: string, isMainPage: boolean) {
        const path = `venues/${venueId}/items/${itemId}`;
        const itemRef = doc(this.firestore, path);
        return (updateDoc(itemRef, { isMainPage }))
    }
    updateItemCoordinates(venueId: string, itemId: string, coordinates: Coordinates) {
        console.log(coordinates)
        const path = `venues/${venueId}/items/${itemId}`;
        const itemRef = doc(this.firestore, path);
        return updateDoc(itemRef, { coordinates })
    }




    async addItemImageToStorage(venueId: string, itemId: string, file: File) {
        if (venueId && itemId && file) {
            try {
                const path = `venues/${venueId}/items/${itemId}/itemImage`
                const storageRef = ref(this.storage, path)
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef);
                return url
            } catch (e: any) {
                console.log(e)
            }
        }
    }

    deleteItemImageFileFromStorage(venueId: string, itemId: string) {
        const path = `venues/${venueId}/items/${itemId}/itemImage`;
        const itemImageRef = ref(this.storage, path);
        return deleteObject(itemImageRef);
    }

    updateItemImageUrl(venueId: string, itemId: string, itemImageUrl) {
        const path = `venues/${venueId}/items/${itemId}`;
        const itemRef = doc(this.firestore, path)
        return updateDoc(itemRef, { imageUrl: itemImageUrl });
    }

}
