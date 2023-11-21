import { Injectable, Output, EventEmitter } from '@angular/core';
import { Venue } from '../shared/models/venue.model';
import { Auth } from '@angular/fire/auth';

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



@Injectable({
    providedIn: 'root'
})
export class VenuesService {

    @Output() venueSelected: EventEmitter<Venue> = new EventEmitter()

    constructor(
        private firestore: Firestore,
        private afAuth: Auth,
    ) { }

    getVenuesByOwnerId(ownerId: string) {
        const pathToVenues = `venues`
        const venuesRef = collection(this.firestore, pathToVenues)
        if (ownerId != 'DhwbsQYD4OVm2j7d5ZzZGiGoHXJ2') {
            const ownerQuery = query(venuesRef, where('ownerId', '==', ownerId), orderBy('name'));
            return collectionData(ownerQuery, { idField: 'id' })
        } else {
            return collectionData(venuesRef, { idField: 'id' })
        }
    }
    getMochucoVenue() {
        const path = `venues`;
        const venuesRef = collection(this.firestore, path);
        const mochucoQuery = query(venuesRef, where('name', '==', 'mochuco'));
        return collectionData(mochucoQuery, { idField: 'id' })
    }

    removeVenueIdFromVenuesOwned(venueId: string) {
        const uid = this.afAuth.currentUser.uid;
        const path = `users/${uid}`
        const userRef = doc(this.firestore, path);
        return updateDoc(userRef, { venuesOwned: arrayRemove(venueId) })
    }

    addVenueIdToUser(venueId: string) {
        const uid = this.afAuth.currentUser.uid;
        const path = `users/${uid}/`
        const venueIdRef = doc(this.firestore, path)
        return updateDoc(venueIdRef, { venuesOwned: arrayUnion(venueId) })
    }
}
