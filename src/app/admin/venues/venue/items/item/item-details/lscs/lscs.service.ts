import { Injectable } from '@angular/core';
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
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { FirebaseError } from '@angular/fire/app';

import { BehaviorSubject, last, map, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import * as VISITOR from 'src/app/visitor/store/visitor.actions';
import { Observable, Subscription, take } from 'rxjs';
import * as fromRoot from 'src/app/app.reducer';
import * as UI from 'src/app/admin/shared/ui.actions'
import { StatisticsService } from '../../../../statistics/statistics.service';


@Injectable({
    providedIn: 'root'
})
export class LscsService {

    languages: string[] = [
        'dutch', 'english', 'german'
    ]

    private nameUpdatedSubject = new BehaviorSubject<string>('')
    public nameUpdated$ = this.nameUpdatedSubject.asObservable()

    private descriptionUpdatedSubject = new BehaviorSubject<string>('')
    public descriptionUdated$ = this.descriptionUpdatedSubject.asObservable();

    private availableLanguagesSubject = new BehaviorSubject<string[]>([])
    public availableLanguages$ = this.availableLanguagesSubject.asObservable();





    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private store: Store,
        private statisticsService: StatisticsService
    ) { }

    getLanguages() {
        return this.languages;
    }

    updateName(name: string) {
        console.log(name)
        this.nameUpdatedSubject.next(name)
    }
    // updateDescription(description: string) {
    //     this.descriptionUpdatedSubject.next(description)
    // }

    updateAvailableLanguages(languages: string[]) {
        console.log(languages)
        this.availableLanguagesSubject.next(languages)
    }

    getlanguages() {
        return this.languages;
    }


    addLsc(venueId: string, itemId: string, lsc: LSC) {
        console.log('addLscToItem');
        const path = `venues/${venueId}/items/${itemId}/languages/${lsc.language}`;
        const lscRef = doc(this.firestore, path);
        return (setDoc(lscRef, lsc))
    }

    getLsc(venueId: string, itemId: string, language: string) {
        // this.store.dispatch(new UI.SetIsLoading(true));
        this.statisticsService.storeVisitInArray(venueId, itemId, language);
        console.log(venueId, itemId, language);
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`;
        const lscRef = doc(this.firestore, path);
        // docData(lscRef).subscribe((lsc: LSC) => {
        //     console.log(lsc)
        // })
        return docData(lscRef)
    }

    storeLsc(venueId: string, itemId: string) {
        this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
            console.log(`lscService 108 - storeLsc(){} ${venueId} - ${itemId} - ${language}`)
            const path = `venues/${venueId}/items/${itemId}/languages/${language}`;
            const lscRef = doc(this.firestore, path);

        })
    }



    // getLscs(venueId: string, itemId: string) {
    //     const promise = new Promise((resolve, reject) => {
    //         console.log(venueId, itemId)
    //         const path = `venues/${venueId}/items/${itemId}/languages`
    //         const lscsRef = collection(this.firestore, path);
    //         resolve(collectionData(lscsRef))
    //     })
    //     return promise
    //     // return collectionData(lscsRef);
    // }

    getLscs(venueId: string, itemId: string) {
        console.log('getLscs()', venueId, itemId)
        const path = `venues/${venueId}/items/${itemId}/languages`
        const lscsRef = collection(this.firestore, path);


        return collectionData(lscsRef);
    }

    updateLSC(venueId: string, itemId: string, lsc: LSC) {
        console.log('updateLSC')
        const path = `venues/${venueId}/items/${itemId}/languages/${lsc.language}`;
        const lscRef = doc(this.firestore, path)
        return setDoc(lscRef, lsc)
    }

    deleteLscFromItem(venueId: string, itemId: string, language: string) {
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`
        const languageRef = doc(this.firestore, path)
        return deleteDoc(languageRef)
    }

    async storeAudioFile(venueId: string, itemId: string, language: string, file: File) {
        if (venueId && itemId && language && file) {
            try {
                const path = `venues/${venueId}/items/${itemId}/languages/${language}`
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = getDownloadURL(storageRef)
                return url
            } catch (e: any) {
                console.log(e)
            }
        }
    }
    updateAudioUrl(venueId: string, itemId: string, language: string, audioUrl) {
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`
        const audioUrlRef = doc(this.firestore, path);
        return updateDoc(audioUrlRef, { audioUrl: audioUrl })
    }

    deleteAudioFromStorage(venueId: string, itemId: string, language: string) {
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`;
        const audioRef = ref(this.storage, path)
        return deleteObject(audioRef)
    }
    updateLscName(venueId: string, itemId: string, language: string, name: string) {
        console.log(venueId, itemId, language, name)
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`
        const lscRef = doc(this.firestore, path)
        return updateDoc(lscRef, { name: name })
    }
    updateLscDescription(venueId: string, itemId: string, language: string, description: string) {
        const path = `venues/${venueId}/items/${itemId}/languages/${language}`
        const lscRef = doc(this.firestore, path)
        return updateDoc(lscRef, { description })
    }

}
