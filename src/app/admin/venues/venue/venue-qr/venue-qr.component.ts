import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { MatButtonModule } from '@angular/material/button';
import { SafeUrl } from '@angular/platform-browser';

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
    qrCodeDownloadLink: any

    constructor(
        private store: Store<fromRoot.State>
    ) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getSelectedVenue).subscribe((adminSelectedVenue: Venue) => {
            if (adminSelectedVenue) {
                this.adminSelectedVenue = adminSelectedVenue
                this.insufficientDataForQr = false;
                this.qrDataString = `https://mochuco-standalone-ec3f0.web.app/?venueId=${adminSelectedVenue.id}`
            } else {

            }
        })
    }
    getWidth() {
        return 300;
    }
    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
}
