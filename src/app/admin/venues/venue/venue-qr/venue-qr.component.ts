import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { MatButtonModule } from '@angular/material/button';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { DocumentData } from '@angular/fire/firestore';

@Component({
    selector: 'app-venue-qr',
    standalone: true,
    imports: [CommonModule, QRCodeModule, MatButtonModule],
    templateUrl: './venue-qr.component.html',
    styleUrls: ['./venue-qr.component.scss']
})
export class VenueQrComponent implements OnInit {

    qrDataString: string;
    insufficientDataForQr: boolean = true;
    adminSelectedVenue: Venue;
    qrCodeDownloadLink: any;
    venue$: Observable<DocumentData>

    constructor(
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.insufficientDataForQr = false;
                this.qrDataString = `https://mochuco-standalone-ec3f0.web.app/?venueId=${venueId}`
                const pathToVenue = `venues/${venueId}`
                this.venue$ = this.firestoreService.getDocument(pathToVenue)
            }
        })
        // this.store.select(fromRoot.getSelectedVenue).subscribe((adminSelectedVenue: Venue) => {
        //     if (adminSelectedVenue) {
        //         this.adminSelectedVenue = adminSelectedVenue
        //         this.insufficientDataForQr = false;
        //         this.qrDataString = `https://mochuco-standalone-ec3f0.web.app/?venueId=${adminSelectedVenue.id}`
        //     } else {

        //     }
        // })
    }
    getWidth() {
        return 300;
    }
    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
}
