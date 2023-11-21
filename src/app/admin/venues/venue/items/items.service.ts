import { Injectable } from '@angular/core';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Coordinates } from 'src/app/admin/shared/models/coordinates.model';
import {
    Storage,
    ref,
    deleteObject,

    listAll,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    getMetadata,
    provideStorage,
    getStorage,
    getBytes,
    StorageError,
    list,
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
    DocumentData,
    FirestoreError
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as fromApp from './../../../../app.reducer';
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscsService } from './item/item-details/lscs/lscs.service';
import { FirebaseError } from '@angular/fire/app';



@Injectable({
    providedIn: 'root'
})
export class ItemsService {

    constructor(
        private firestore: Firestore,
        private store: Store<fromApp.State>,
        private storage: Storage,
        // private lscsService: LscsService
        // private itemsService: ItemsService
    ) { }

    // addItem(venueId: string, item: Item): Promise<DocumentReference<DocumentData>> {
    //     const path = `venues/${venueId}/items`
    //     const itemRef = collection(this.firestore, path)
    //     return addDoc(itemRef, item)
    // }

    // listStoredFiles(path) {
    //     const languagesRef = ref(this.storage, path);
    //     const promise = new Promise((resolve, reject) => {
    //         listAll(languagesRef)
    //             .then((data: any) => {
    //                 // console.log(data)
    //                 const pathsListArray: string[] = []
    //                 data.items.forEach((item: any) => {
    //                     // console.log(item._location.path_)
    //                     pathsListArray.push(item._location.path_)
    //                 })
    //                 resolve(pathsListArray)
    //             })

    //     })
    //     return promise
    // }

    // checkForExistingFile(path) {
    //     const storageRef = ref(this.storage, path)
    //     return getDownloadURL(storageRef)
    // }


    // getItems(venueId) {
    //     const path = `venues/${venueId}/items`
    //     const itemsRef = collection(this.firestore, path);
    //     const itemsQuery = query(itemsRef, orderBy('name'));
    //     return collectionData(itemsQuery, { idField: 'id' });
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

    deleteDocumentFromDb(path) {
        const documentRef = doc(this.firestore, path)
        return deleteDoc(documentRef)
    }

    deleteItem(venueId: string, itemId: string) {
        // console.log('deleteItem')
        const path = `venues/${venueId}/items/${itemId}/itemImage`;
        const itemImageRef = ref(this.storage, path);
        return deleteObject(itemImageRef)
            .then((res: any) => {
                console.log(`item image removed from storage`);
            })
            .catch((err: StorageError) => {
                console.log(`failed to remove item image from storage; ${err}`)
            })

    }
    deleteItemFromFirestoreDB(venueId: string, itemId: string) {
        console.log(venueId, itemId)
        this.getLanguagesFromDb(venueId, itemId)
            .then((languages: string[]) => {
                // console.log(languages);
                languages.forEach((language: string) => {
                    // console.log(language)
                    const path = `venues/${venueId}/items/${itemId}/languages/${language}`;
                    const languageRef = doc(this.firestore, path);
                    return deleteDoc(languageRef)
                })
            })
            .then((data: any) => {
                // console.log(data)
            })

    }

    deleteItemFromStorage(venueId: string, itemId: string) {
        const path = `venues/${venueId}/items/${itemId}/itemImage`;
        const itemImageRef = ref(this.storage, path);
        return deleteObject(itemImageRef);

    }

    private getLanguagesFromDb(venueId: string, itemId: string) {
        console.log('getLanguagesFromDb()');
        const path = `venues/${venueId}/items/${itemId}/languages`;
        const lscsRef = collection(this.firestore, path)

        const promise = new Promise((resolve, reject) => {
            collectionData(lscsRef).subscribe((lscs: LSC[]) => {
                // console.log(lscs);
                let languages: string[] = []
                lscs.forEach((lsc: LSC) => {
                    // console.log(lsc)
                    if (lsc.language) {
                        languages.push(lsc.language)
                    }
                    resolve(languages)
                })

            })
        })
        return promise
    }

    private deleteAudioFileFromStorage(venueId: string, itemId: string, language: string) {
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`;
        const languageRef = ref(this.storage, path)
        return deleteObject(languageRef)
    }
    private deleteItemImageFromStorage(venueId: string, itemId: string) {
        const path = `venues/${venueId}/items/${itemId}`
        const imageRef = ref(this.storage, path);
        return deleteObject(imageRef)
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
    // updateItemCoordinates(venueId: string, itemId: string, coordinates: Coordinates) {
    //     console.log(coordinates)
    //     const path = `venues/${venueId}/items/${itemId}`;
    //     const itemRef = doc(this.firestore, path);
    //     return updateDoc(itemRef, { coordinates })
    // }




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
                // console.log(e)
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
