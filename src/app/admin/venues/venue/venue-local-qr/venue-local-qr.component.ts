import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { SafeUrl } from '@angular/platform-browser';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
    selector: 'app-venue-local-qr',
    standalone: true,
    imports: [CommonModule, QRCodeModule],
    templateUrl: './venue-local-qr.component.html',
    styleUrls: ['./venue-local-qr.component.scss']
})
export class VenueLocalQrComponent {

    logoPath: string = ''

    qrDataString: string
    selectedVenue: Venue;

    innerWidth: number;
    insufficientDataForQr: boolean = false


    public myAngularxQrCode: string = "";
    public qrCodeDownloadLink: SafeUrl = "";

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }


    constructor(
        private store: Store<fromRoot.State>,

    ) { }
    ngOnInit(): void {
        this.innerWidth = window.innerWidth;
        // console.log(this.innerWidth);
        // console.log(document.body.offsetWidth)
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                // console.log(selectedVenue)
                this.selectedVenue = { ...selectedVenue }
                this.qrDataString = `http://localhost:4200?venueId=${this.selectedVenue.id}`

            } else {
                console.log('insufficient data');
            }
        })
    }
    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
    getWidth() {
        return document.body.offsetWidth / 5
    }
}
