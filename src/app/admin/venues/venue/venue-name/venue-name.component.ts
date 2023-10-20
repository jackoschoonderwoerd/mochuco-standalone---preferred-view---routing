import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venue } from '../../../shared/models/venue.model';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import { VenuesService } from '../../venues.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '@angular/fire/auth';
import { UiService } from 'src/app/admin/shared/ui.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
    @Output() editmodeChanged = new EventEmitter<boolean>

    constructor(
        private store: Store<fromRoot.State>,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private afAuth: Auth,
        private uiService: UiService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm()
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.editmode = true;
                this.form.patchValue({
                    name: selectedVenue.name
                })
                this.selectedVenue = { ...selectedVenue }
                this.venue$ = this.venuesService.getVenueByVenueId(this.selectedVenue.id)
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
        const newVenue: Venue = {
            ownerId: this.afAuth.currentUser.uid,
            name: this.form.value.name
        }
        this.venuesService.addVenue(newVenue)
            .then((docRef: DocumentReference) => {
                const venueId = docRef.id
                this.venue$ = this.venuesService.getVenueByVenueId(venueId);
                this.addVenueIdToUserVenuesOwned(venueId)
                newVenue.id = venueId;
                this.uiService.openSnackbar('venue added');
                this.store.dispatch(new ADMIN.SetSelectedVenue(newVenue));
                this.editmodeChanged.emit(true)

            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`adding venue failed; ${err.message}`)
                this.store.dispatch(new ADMIN.SetSelectedVenue(null));
            });
    }

    addVenueIdToUserVenuesOwned(venueId) {
        this.venuesService.addVenueIdToUser(venueId)
            .then((res: any) => {
                this.uiService.openSnackbar('venueId added to user')
            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`failed to add venueId to user; ${err.message}`)
            })
    }

    updateVenueName() {
        const updatedVenue = { ...this.selectedVenue };
        updatedVenue.name = this.form.value.name
        this.venuesService.setVenue(updatedVenue)
            .then((res) => {
                this.uiService.openSnackbar('venue updated')
                this.store.dispatch(new ADMIN.SetSelectedVenue(null));
            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`failed to update venue; ${err.message}`);
                this.store.dispatch(new ADMIN.SetSelectedVenue(null));
            });
    }
}
