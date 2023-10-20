import { Injectable, Output, EventEmitter } from '@angular/core';
import { Venue } from '../shared/models/venue.model';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { User as FirebaseUser } from "@angular/fire/auth";
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
    DocumentData,
    arrayUnion,
    arrayRemove
} from '@angular/fire/firestore';
import { Observable, tap, take } from 'rxjs';
import * as fromRoot from './../../app.reducer';
import * as UI from './../shared/ui.actions'
import { Store } from '@ngrx/store';


@Injectable({
    providedIn: 'root'
})
export class VenuesService {

    @Output() venueSelected: EventEmitter<Venue> = new EventEmitter()

    constructor(
        private firestore: Firestore,
        private store: Store<fromRoot.State>,
        private afAuth: Auth,
        private storage: Storage

    ) { }

    getVenueByVenueId(venueId): Observable<DocumentData> {
        const path = `venues/${venueId}`
        const venueRef = doc(this.firestore, path)
        return docData(venueRef, { idField: 'id' })
    }

    getVenues() {
        const path: string = 'venues'
        const venuesRef = collection(this.firestore, path);
        return collectionData(venuesRef, { idField: 'id' })
            .pipe(
                tap(() => {
                    this.store.dispatch(new UI.SetIsLoading(false));
                })
            );
    }

    getVenuesByOwnerId(ownerId: string) {
        const path = `venues`
        const venuesRef = collection(this.firestore, path)
        const ownerQuery = query(venuesRef, where('ownerId', '==', ownerId), orderBy('name'));
        return collectionData(ownerQuery, { idField: 'id' })
    }
    getMochucoVenue() {
        // const m
        const path = `venues`;
        const venuesRef = collection(this.firestore, path);
        const mochucoQuery = query(venuesRef, where('name', '==', 'mochuco'));
        return collectionData(mochucoQuery, { idField: 'id' })
    }

    addVenue(venue: Venue) {
        console.log(venue);
        const path: string = 'venues';
        const venueRef = collection(this.firestore, path)
        return addDoc(venueRef, venue)
    }
    deleteVenue(venueId: string) {
        const path = `venues/${venueId}`;
        const venueRef = doc(this.firestore, path)
        return deleteDoc(venueRef)
    }

    removeVenueIdFromVenuesOwned(venueId: string) {
        console.log(venueId);
        const uid = this.afAuth.currentUser.uid;
        const path = `users/${uid}`
        const userRef = doc(this.firestore, path);
        return updateDoc(userRef, { venuesOwned: arrayRemove(venueId) })
    }
    setVenue(venue: Venue) {
        console.log(venue);
        const path = `venues/${venue.id}`;
        const venueRef = doc(this.firestore, path)
        return setDoc(venueRef, venue)
    }
    addVenueIdToUser(venueId: string) {
        const uid = this.afAuth.currentUser.uid;
        console.log(uid, venueId)
        // const document = {venueId:null}
        const path = `users/${uid}/`
        const venueIdRef = doc(this.firestore, path)
        return updateDoc(venueIdRef, { venuesOwned: arrayUnion(venueId) })
    }

    storeUserInDb(uid: string) {
        const userData = { uid: uid, venuesOwned: [] };
        const path = `users/${uid}`
        const userRef = doc(this.firestore, path)
        setDoc(userRef, userData).then((res: any) => {
            console.log(res)
        })
            .catch(err => {
                console.log(err);
            })
    }
    async addLogoToStorage(venueId, file) {
        if (file && venueId) {
            if (file) {
                try {
                    const path = `venues/${venueId}/logo`
                    const storageRef = ref(this.storage, path);
                    const task = uploadBytesResumable(storageRef, file);
                    await task;
                    const url = await getDownloadURL(storageRef)
                    return url;
                } catch (e: any) {
                    console.log(e);
                }
            } else {
                // this.deleteLogo(venueId);
            }
        }
    }


    deleteLogoFromStorage(venueId: string) {
        const path = `venues/${venueId}/logo`;
        const storage = getStorage()
        const logoRef = ref(storage, path)
        return deleteObject(logoRef)
    }

    updateVenueLogoUrl(venueId: string, logoUrl: string) {
        const path = `venues/${venueId}`
        const venueRef = doc(this.firestore, path);
        return updateDoc(venueRef, { logoUrl })
    }

    async addVenueImageToStorage(venueId: string, file: File) {
        if (file && venueId) {
            try {
                const path = `venues/${venueId}/venueImage`
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef)
                return url;
            } catch (e: any) {
                console.log(e);
            }
        }
    }
    deleteVenueImageFromStorage(venueId: string) {
        const path = `venues/${venueId}/venueImage`;
        const storage = getStorage()
        const logoRef = ref(storage, path)
        return deleteObject(logoRef)
    }

    updateVenueImageUrl(venueId: string, imageUrl) {
        const path = `venues/${venueId}`
        const venueRef = doc(this.firestore, path);
        return updateDoc(venueRef, { imageUrl })
    }
}
