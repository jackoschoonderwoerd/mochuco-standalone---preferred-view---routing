import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiService } from 'src/app/admin/shared/ui.service';
import { Venue } from '../../../shared/models/venue.model';
import { VenuesService } from '../../venues.service';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import * as fromRoot from 'src/app/app.reducer';
import { FirebaseError } from '@angular/fire/app';

@Component({
    selector: 'app-venue-name',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule
    ],
    templateUrl: './venue-name.component.html',
    styleUrls: ['./venue-name.component.scss']
})


export class VenueNameComponent implements OnInit {

    form: FormGroup
    editmode: boolean = false
    selectedVenue: Venue;
    venue$: Observable<DocumentData>;
    venueId: string;
    @Output() editmodeChanged = new EventEmitter<boolean>

    constructor(
        private store: Store<fromRoot.State>,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private afAuth: Auth,
        private uiService: UiService,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId;
                this.editmode = true;
                const pathToVenue = `venues/${venueId}`
                this.firestoreService.getDocument(pathToVenue).subscribe((venue: Venue) => {
                    if (venue) {
                        this.form.patchValue({
                            name: venue.name
                        })
                    }
                })
            }
        })

    }
    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    onAddOrUpdateVenue() {
        if (!this.editmode) {
            this.addVenue()
        } else {
            this.updateVenueName()
        }
    }


    addVenue() {
        const venue: Venue = {
            ownerId: this.afAuth.currentUser.uid,
            name: this.form.value.name
        }
        const pathToVenues = `venues`;
        this.firestoreService.addDoc(pathToVenues, venue)
            // this.venuesService.addVenue(venue)
            .then((docRef: DocumentReference) => {
                this.venueId = docRef.id
                console.log(this.venueId)
                // this.venue$ = this.firestoreService.getDocument(pathToVenue);
                // this.store.dispatch(new ADMIN.SetAdminVenueId(this.venueId));
            })
            .then(() => {
                const pathToVenue = `venues/${this.venueId}`
                this.venue$ = this.firestoreService.getDocument(pathToVenue);
            })
            .then(() => {
                this.updateStore()
                return 'store updated'
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to add venue; ${err.message}`)
            })
            .then((message: string) => {
                console.log(message)
                return this.addVenueIdToUserVenuesOwned(this.venueId)
            })
            .then((res: any) => {
                console.log(`venueId added to user venues owned`)
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to add venueId to user-venues owned; ${err.message}`)
            })
    }

    private addVenueIdToUserVenuesOwned(venueId) {
        return this.venuesService.addVenueIdToUser(venueId)
    }
    private updateStore() {
        this.store.dispatch(new ADMIN.SetAdminVenueId(this.venueId));
    }

    updateVenueName() {
        // const updatedVenue = { ...this.selectedVenue };
        // updatedVenue.name = this.form.value.name
        let name: string = this.form.value.name;
        name = name.toLowerCase()
        // this.venuesService.setVenue(updatedVenue)
        const pathToVenue = `venues/${this.venueId}`
        this.firestoreService.updateDocument(pathToVenue, { name })
            .then((res) => {
                this.uiService.openSnackbar('venue-name updated')
                // this.store.dispatch(new ADMIN.SetAdminVenueId(null));
            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`failed to update venue-name; ${err.message}`);
                // this.store.dispatch(new ADMIN.SetAdminVenueId(null));
            });
    }
}
