import { Injectable } from '@angular/core';
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
    ListResult,
} from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(
        private storage: Storage
    ) { }

    deleteObject(path: string): Promise<void> {
        // console.log(`deleteFile(); ${path}`);
        const fileRef = ref(this.storage, path);
        return deleteObject(fileRef)
    }
    listAll(path: string): Promise<ListResult> {
        // console.log(`listAll: ${path}`)
        const filesRef = ref(this.storage, path);
        return listAll(filesRef)
    }
    getDownloadUrl(path: string): Promise<string> {
        // console.log(`getDownloadUrl(${path})`)
        const fileRef = ref(this.storage, path);
        return getDownloadURL(fileRef);
    }
    storeObject(path: string, file: File) {
        if (path && file) {
            // console.log(path, file)
            const storageRef = ref(this.storage, path);
            return uploadBytesResumable(storageRef, file)
                .then((data: any) => {
                    // console.log(data)
                    return getDownloadURL(storageRef)
                })
                .then((url: string) => {
                    // console.log(url)
                    return url
                })
        }
    }

}
// venues/BaCaHxfTlQZExjwYjW8b/items/b0tS1gHzSZNS0J3gu9B6/itemImage
//  venues/BaCaHxfTlQZExjwYjW8b/items/b0tS1gHzSZNS0J3gu9B6/itemImage
