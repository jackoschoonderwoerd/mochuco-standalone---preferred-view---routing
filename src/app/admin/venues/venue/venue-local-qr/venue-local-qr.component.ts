import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { Observable } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'

@Component({
    selector: 'app-venue-local-qr',
    standalone: true,
    imports: [CommonModule, QRCodeModule],
    templateUrl: './venue-local-qr.component.html',
    styleUrls: ['./venue-local-qr.component.scss']
})
export class VenueLocalQrComponent {

    qrDataString: string
    innerWidth: number;
    insufficientDataForQr: boolean = true;
    venue$: Observable<DocumentData>


    public myAngularxQrCode: string = "";
    public qrCodeDownloadLink: SafeUrl = "";

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }


    constructor(
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService

    ) { }
    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.insufficientDataForQr = false;
                console.log(venueId)
                this.qrDataString = `http://localhost:4200?venueId=${venueId}`
                const pathToVenue = `venues/${venueId}`
                this.venue$ = this.firestoreService.getDocument(pathToVenue);
            }
        })
        this.innerWidth = window.innerWidth;
    }
    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
    getWidth() {
        return document.body.offsetWidth / 5
    }
}
