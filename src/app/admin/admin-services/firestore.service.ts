import { Injectable } from '@angular/core';

import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    collectionData,
    collectionGroup,
    deleteDoc,
    doc,
    docData,
    DocumentData,
    DocumentReference,
    Firestore,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import { Coordinates } from '../shared/models/coordinates.model';
import { first, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(
        private firestore: Firestore
    ) { }

    getCollectionPromise(path: string) {
        return new Promise((resolve, reject) => {
            const collectionRef = collection(this.firestore, path);
            collectionData(collectionRef, { idField: 'id' }).subscribe({
                next: data => {
                    resolve(data)
                }
            })
        })
    }

    getCollection(path: string) {

        const collectionRef = collection(this.firestore, path);
        return collectionData(collectionRef, { idField: 'id' })

    }
    setDoc(path, document) {
        const docRef = doc(this.firestore, path)
        return setDoc(docRef, document)
    }
    addDoc(path: string, document: object) {
        console.log(path, document)
        const collectionRef = collection(this.firestore, path)
        return addDoc(collectionRef, document)
    }

    getDocument(path: string) {
        const docRef = doc(this.firestore, path);
        return docData(docRef, { idField: 'id' })
    }

    deleteDocument(path: string) {
        // console.log('deleting doc')
        const docRef = doc(this.firestore, path);
        return deleteDoc(docRef)
    }

    collectionData(path) {
        // console.log(`collectionData(${path})`)
        const collectionRef = collection(this.firestore, path);
        return collectionData(collectionRef, { idField: 'id' });
    }
    updateAudioUrl(path, newValue) {
        const docRef = doc(this.firestore, path);
        return updateDoc(docRef, { audioUrl: newValue })
    }


    updateDocument(path: string, newValueObject: object) {
        const docRef = doc(this.firestore, path)
        return updateDoc(docRef, newValueObject)
    }
}
