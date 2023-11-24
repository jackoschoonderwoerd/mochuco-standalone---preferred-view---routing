import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
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
    or,
    arrayUnion
} from '@angular/fire/firestore';
import { VisitData } from 'src/app/admin/shared/models/visit-data';
import { ItemsService } from '../items/items.service';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { first, take } from 'rxjs';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    constructor(
        private firestore: Firestore,
        private itemsService: ItemsService,
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService
    ) { }

    getVisitsByVenue(venueId) {
        const pathToStatistics = `venues/${venueId}/statistics`;
        const statisticsRef = collection(this.firestore, pathToStatistics)
        return collectionData(statisticsRef)
    }

    storeVisitInArray(venueId: string, itemId: string, language: string) {
        this.getVisitsArray(venueId, itemId).pipe(take(1)).subscribe((data: any[]) => {
            console.log(data)
            if (data) {
                console.log(data, 'updateDoc())')
                this.updateArray(venueId, itemId, language)
            } else {
                console.log(data, 'setDoc())')
                this.createArray(venueId, itemId, language)
            }
        })
    }

    updateArray(venueId: string, itemId: string, language: string) {
        this.getItemName(venueId, itemId).then((itemName: string) => {
            const visitData: VisitData = {
                venueId,
                itemId,
                itemName,
                language,
                timestamp: Date.now()
            }

            const path = `venues/${venueId}/statistics/${itemId}`
            const statisticsRef = doc(this.firestore, path);
            updateDoc(statisticsRef, {
                visits: arrayUnion(visitData)
            })
                .then((res) => {
                    // console.log(res)
                })
                .catch((err: FirebaseError) => {
                    // console.log(err)
                })
        })
    }
    createArray(venueId: string, itemId: string, language: string) {
        this.getItemName(venueId, itemId).then((itemName: string) => {
            const visitData: VisitData = {
                venueId,
                itemId,
                itemName,
                language,
                timestamp: Date.now()
            }
            const path = `venues/${venueId}/statistics/${itemId}`
            const statisticsRef = doc(this.firestore, path);
            setDoc(statisticsRef, {
                visits: arrayUnion(visitData)
            })
                .then((res) => {
                    // console.log(res)
                })
                .catch((err: FirebaseError) => {
                    console.log(err)
                })
        })
    }

    getVisitsArray(venueId: string, itemId: string) {
        console.log(venueId, itemId)
        const pathToItemVisits = `venues/${venueId}/statistics/${itemId}`
        const visitsRef = doc(this.firestore, pathToItemVisits);
        const pathToStatistics = `venues/${venueId}/statistics`
        const statisticsRef = collection(this.firestore, pathToStatistics)
        // docData(visitsRef).subscribe((data: any) => {
        //     console.log(data);
        // })
        return collectionData(statisticsRef);
    }

    storeVisit(venueId: string, itemId: string, language: string) {
        // console.log(venueId, itemId, language)
        this.getItemName(venueId, itemId).then((itemName: string) => {
            const visitData: VisitData = {
                venueId,
                itemId,
                itemName,
                language,
                timestamp: Date.now()
            }

            const path = `venues/${venueId}/statistics/`
            const statisticsRef = collection(this.firestore, path);
            addDoc(statisticsRef, visitData)
                .then((res) => {
                    // console.log(res)
                })
                .catch((err: FirebaseError) => {
                    console.log(err)
                })
        })
    }


    getItemName(venueId: string, itemId: string) {
        const promise = new Promise((resolve, reject) => {
            const pathToItem = `venues/${venueId}/items/${itemId}`
            this.firestoreService.getDocument(pathToItem).subscribe((item: Item) => {
                // this.itemsService.getItemByItemId(venueId, itemId).subscribe((item: Item) => {
                if (item && item.name) {
                    resolve(item.name)
                } else {
                    reject('getting item / item.name failed')
                }
            })
        })
        return promise
    }
    getStatistics(venueId: string) {
        // console.log(venueId)
        const path = `venues/${venueId}/statistics`;
        // this.firestoreService.getCollection(path)
        return this.firestoreService.getCollection(path)
        // const statisticsRef = collection(this.firestore, path);
        // return collectionData(statisticsRef)

    }
    getOrderedStatistics(venueId: string, active: string, direction: string) {
        console.log(venueId, active, direction)
        const path = `venues/${venueId}/statistics`;
        const statisticsRef = collection(this.firestore, path);
        if (direction === 'asc') {
            const q = query(statisticsRef, orderBy(active, 'asc'))
            return collectionData(q)
        } else if (direction === 'desc') {
            const q = query(statisticsRef, orderBy(active, 'desc'))
            return collectionData(q)
        }
    }
    getOrderdVisitsByItemId(venueId: string, itemId: string) {
        const pathToVisitsArray = `venues/${venueId}/statistics/${itemId}`

    }
}
