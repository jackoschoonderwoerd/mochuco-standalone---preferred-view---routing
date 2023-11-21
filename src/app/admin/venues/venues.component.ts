import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Observable, from, of, merge, take } from 'rxjs'
import { Venue } from '../shared/models/venue.model';
import { VenuesService } from './venues.service';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as ADMIN from '../store/admin.actions';
import * as UI from './../shared/ui.reducer'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { FirebaseError } from '@angular/fire/app';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { User as FirebaseUser } from "@angular/fire/auth";
import { LogoComponent } from './venue/logo/logo.component';
import { ListResult, StorageError, list, listAll } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../shared/warning/warning.component';
import { FirestoreError } from '@angular/fire/firestore';
import { Item } from '../shared/models/item.model';
import { FirestoreService } from '../admin-services/firestore.service';
import { StorageService } from '../admin-services/storage.service';
import { StorageListAllData } from '../shared/models/storage-list-all-data';



@Component({
    selector: 'app-venues',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,

    ],
    templateUrl: './venues.component.html',
    styleUrls: ['./venues.component.scss']
})


export class VenuesComponent implements OnInit {

    venues$: Observable<any[]>
    isLoading$: Observable<boolean>
    ownedVenues$: Observable<any>
    venue$: Observable<any>
    venueObservablesArray: any[] = []

    constructor(
        private router: Router,
        private venuesService: VenuesService,
        private uiService: UiService,
        private store: Store<fromRoot.State>,
        private afAuth: Auth,
        private dialog: MatDialog,
        private firestoreService: FirestoreService,
        private storageService: StorageService
    ) { }

    ngOnInit(): void {
        this.isLoading$ = this.store.select(fromRoot.getIsLoading);
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                const ownerId = user.uid
                this.venues$ = this.venuesService.getVenuesByOwnerId(ownerId)
            }
        })
        this.store.dispatch(new ADMIN.SetAdminItemId(null))
        this.store.dispatch(new ADMIN.SetAdminLanguage(null))
    }

    onAddVenue() {
        this.store.dispatch(new ADMIN.SetAdminVenueId(null));
        this.store.dispatch(new ADMIN.SetAdminItemId(null));
        this.store.dispatch(new ADMIN.SetAdminLanguage(null));
        this.router.navigateByUrl('admin/venue')
    }

    onVenueDetails(venueId: string) {
        // console.log(venue)
        this.store.dispatch(new ADMIN.SetAdminVenueId(venueId))
        // this.store.dispatch(new ADMIN.SetSelectedVenue(venue))
        this.router.navigateByUrl('admin/venue')
    }

    onDelete(venueId: string) {

        const itemsPath = `venues/${venueId}/items`;
        const venuePath = `venues/${venueId}`;
        this.firestoreService.collectionData(itemsPath).pipe(take(1)).subscribe((items: Item[]) => {
            this.firestoreService.getDocument(venuePath).pipe(take(1)).subscribe((venue: Venue) => {
                // console.log(venue);
                if (items.length && venue.logoUrl) {
                    this.warnVenueNotEmpty('delete item(s) and logo first')
                } else if (items.length && !venue.logoUrl) {
                    this.warnVenueNotEmpty('delete item(s) first')

                } else if (!items.length && venue.logoUrl) {
                    this.warnVenueNotEmpty('delete logo first')

                } else {
                    // console.log('proceed');
                    const dialogRef = this.dialog.open(ConfirmComponent, {
                        data: {
                            message: `Are you sure? This will permanently delete the venue`
                        }
                    })
                    dialogRef.afterClosed().subscribe((res: boolean) => {
                        if (res) {
                            const venuePath = `venues/${venueId}`
                            this.firestoreService.deleteDocument(venuePath)
                                .then((res: any) => {
                                    console.log(`venue deleted`);
                                })
                                .catch((err: FirebaseError) => {
                                    console.error(`failed to delete venue; ${err.message}`)
                                })
                                .then(() => {
                                    return this.removeVenueIdFromVenuesOwned(venueId)
                                })
                                .then(() => {
                                    console.log(`venueId removed from user-venuesOwned`)
                                })
                                .catch((err: FirebaseError) => {
                                    console.error(`failed to remove venueId from user-venuesOwned; ${err.message}`)
                                })
                        }
                    })
                }

            });
        });
    }

    removeVenueIdFromVenuesOwned(venueId: string) {
        return this.venuesService.removeVenueIdFromVenuesOwned(venueId)
    }

    warnVenueNotEmpty(messageExtension: string) {
        let baseMessage: string = 'The venue needs to be empty before it can be deleted; ';
        this.dialog.open(WarningComponent, {
            data: {
                message: `${baseMessage} ${messageExtension}`
            }
        });
    }
}

