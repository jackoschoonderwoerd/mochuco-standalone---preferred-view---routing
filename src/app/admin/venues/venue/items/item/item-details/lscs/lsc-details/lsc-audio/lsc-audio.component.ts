import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscsService } from '../../lscs.service';
import { DocumentData } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { UiService } from 'src/app/admin/shared/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageService } from 'src/app/admin/admin-services/storage.service';
import { StorageError } from '@angular/fire/storage';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { StoreService } from 'src/app/admin/admin-services/store.service';

@Component({
    selector: 'app-select-audio',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        ConfirmComponent,
        MatProgressSpinnerModule
    ],
    templateUrl: './lsc-audio.component.html',
    styleUrls: ['./lsc-audio.component.scss']
})
export class SelectAudioComponent implements OnInit {

    editmode: boolean = false;
    selectedVenue: Venue;
    selectedItem: Item;
    selectedLsc: LSC;
    lsc$: Observable<DocumentData>
    isLoading: boolean = false;
    venueId: string;
    itemId: string;
    language: string;


    constructor(
        private store: Store<fromRoot.State>,
        private dialog: MatDialog,
        private storageService: StorageService,
        private firestoreService: FirestoreService,

    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId;
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.itemId = itemId;
                        this.store.select(fromRoot.getAdminLanguage).subscribe((language: string) => {
                            if (language) {
                                this.language = language
                                const pathToLsc = `venues/${venueId}/items/${itemId}/languages/${language}`
                                this.lsc$ = this.firestoreService.getDocument(pathToLsc)
                            }
                        })
                    }
                })
            }
        })

    }

    onAudioInputChange(event: any) {
        this.isLoading = true
        if (event && event.target instanceof Element) {
            const file = event.target.files[0]
            console.log(file);
            this.storeAudioFile(file)
                .then((audioUrl: string) => {
                    return this.updateAudioUrl(audioUrl)
                })
                .then((res: any) => {
                    console.log(res)
                    this.isLoading = false;
                })
        }
    }

    onDeleteAudio() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'Are you sure? This will permanently delete the audio file'
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                // const path = `venues/${this.venueId}/items/${this.itemId}/languages/${this.language}`;
                this.deleteAudioFile()
                    .then((res: any) => {
                        return this.updateAudioUrl(null)
                    })
                    .then(() => {
                        console.log('file removed, url updated to null')
                    })
            }
        })
    }

    private storeAudioFile(file: File) {
        const storagePathToAudioFolder = `venues/${this.venueId}/items/${this.itemId}/languages/${this.language}`
        return this.storageService.storeObject(storagePathToAudioFolder, file)
    }

    private deleteAudioFile() {
        const storagePathToAudioFile = `venues/${this.venueId}/items/${this.itemId}/languages/${this.language}`
        return this.storageService.deleteObject(storagePathToAudioFile)
    }

    private updateAudioUrl(audioUrl: string) {
        const pathToAudioUrl = `venues/${this.venueId}/items/${this.itemId}/languages/${this.language}`
        return this.firestoreService.updateDocument(pathToAudioUrl, { audioUrl })
    }

}
