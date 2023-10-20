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

    constructor(
        private venuesService: VenuesService,
        private uiService: UiService,
        private dialog: MatDialog,
        private store: Store<fromRoot.State>
    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            // console.log(selectedVenue)
            if (selectedVenue) {
                this.selectedVenue = { ...selectedVenue };
                this.venue$ = this.venuesService.getVenueByVenueId(selectedVenue.id)
            }
        })
    }

    onLogoInputChange(e) {
        const file = e.target.files[0]
        this.venuesService.addLogoToStorage(this.selectedVenue.id, file)
            .then((logoUrl: string) => {
                console.log(logoUrl)
                this.selectedVenue.logoUrl = logoUrl
                this.venuesService.updateVenueLogoUrl(this.selectedVenue.id, logoUrl)
                    .then((res: any) => {
                        console.log(res);
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
                this.venuesService.deleteLogoFromStorage(this.selectedVenue.id)
                    .then((res: any) => {
                        this.uiService.openSnackbar('logo file removed from storage');
                        this.venuesService.updateVenueLogoUrl(this.selectedVenue.id, null)
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
