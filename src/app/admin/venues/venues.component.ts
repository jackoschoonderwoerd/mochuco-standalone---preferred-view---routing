import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Observable, from, of, merge } from 'rxjs'
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
        private afAuth: Auth
    ) { }

    ngOnInit(): void {
        this.isLoading$ = this.store.select(fromRoot.getIsLoading);
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                const ownerId = user.uid
                this.venues$ = this.venuesService.getVenuesByOwnerId(ownerId)
            }
        })
        this.store.dispatch(new ADMIN.SetSelectedItem(null))
        this.store.dispatch(new ADMIN.SetSelectedLSC(null))
    }

    onAddVenue() {
        this.store.dispatch(new ADMIN.SetSelectedVenue(null));
        this.store.dispatch(new ADMIN.SetSelectedItem(null));
        this.store.dispatch(new ADMIN.SetSelectedLSC(null));
        this.router.navigateByUrl('admin/venue')
    }

    onVenueDetails(venue: Venue) {
        console.log(venue)
        this.store.dispatch(new ADMIN.SetSelectedVenue(venue))
        this.router.navigateByUrl('admin/venue')
    }

    onDelete(venueId: string) {
        const message = 'Are you sure? This will permanently delete the selected venue'
        this.uiService.confirm(message)
            .then((res: boolean) => {
                if (res) {
                    this.venuesService.deleteVenue(venueId)
                        .then((res: any) => {
                            this.uiService.openSnackbar('venue deleted');
                            this.removeVenueIdFromVenuesOwned(venueId);
                        })
                        .catch((err: any) => {
                            this.uiService.openSnackbar(`failed to delete venue, ${err.message}`)
                        })
                }
            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`failed to delete venue, ${err.message}`)
            })
    }
    removeVenueIdFromVenuesOwned(venueId: string) {
        this.venuesService.removeVenueIdFromVenuesOwned(venueId)
            .then((res) => {
                this.uiService.openSnackbar(`venueId removed from user'\s venuesOwned`)
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to remove venueId form user\'s venues owned; ${err.message}`)
                console.log(err);
            });
    }
}

