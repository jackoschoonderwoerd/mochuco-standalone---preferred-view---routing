import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenuesService } from '../../venues.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import { MatButtonModule } from '@angular/material/button';
import * as fromRoot from 'src/app/app.reducer'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DocumentData } from '@angular/fire/firestore';
import { State } from '../../../../app.reducer';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { StorageService } from 'src/app/admin/admin-services/storage.service';

@Component({
    selector: 'app-logo',
    standalone: true,
    imports: [
        CommonModule,
        ConfirmComponent,
        MatButtonModule
    ],
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

    selectedVenue: Venue;
    venue$: Observable<DocumentData>;
    adminVenueId: string;


    constructor(
        private uiService: UiService,
        private dialog: MatDialog,
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService,
        private storageService: StorageService
    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((adminVenueId: string) => {
            if (adminVenueId) {
                this.adminVenueId = adminVenueId
                const pathToVenue = `venues/${adminVenueId}`
                this.venue$ = this.firestoreService.getDocument(pathToVenue)
            }
        })
    }

    onLogoInputChange(e) {
        const file = e.target.files[0]
        const storagePathToLogo = `venues/${this.adminVenueId}/logo`
        this.storageService.storeObject(storagePathToLogo, file)
            .then((logoUrl: string) => {
                console.log(logoUrl);
                const firestorePathToVenue = `venues/${this.adminVenueId}`
                this.firestoreService.updateDocument(firestorePathToVenue, { logoUrl: logoUrl })
                    .then((res: any) => {
                        this.uiService.openSnackbar('logourl updated')
                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to update logourl; ${err.message}`)
                    })
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to store logo; ${err.message}`)
            })
    }


    onDeleteLogo() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'Are you sure? This will premanently remove the selected logo.'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                const storagePathToLogo = `venues/${this.adminVenueId}/logo`
                this.storageService.deleteObject(storagePathToLogo)
                    .then((res: any) => {
                        this.uiService.openSnackbar('logo file removed from storage');
                        const firestorePathToLogo = `venues/${this.adminVenueId}`
                        this.firestoreService.updateDocument(firestorePathToLogo, { logoUrl: null })
                            .then((res: any) => {
                                this.uiService.openSnackbar('logo url updated')
                            })
                            .catch((err: FirebaseError) => {
                                this.uiService.openSnackbar(`failed to update logo url; ${err.message}`)
                            })

                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to remove logo file from storage; ${err.message}`)
                    })
            }
            return;
        })
    }
}
