import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

@Component({
    selector: 'app-item-qr-local',
    standalone: true,
    imports: [CommonModule, QRCodeModule, MatButtonModule],
    templateUrl: './item-qr-local.component.html',
    styleUrls: ['./item-qr-local.component.scss']
})
export class ItemQrLocalComponent {
    logoPath: string = ''

    qrDataString: string
    selectedVenue: Venue;
    selectedItem: Item;
    innerWidth: number;
    insufficientDataForQr: boolean = false;
    item$: Observable<DocumentData>


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
        this.innerWidth = window.innerWidth;
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.qrDataString = `http://localhost:4200?venueId=${venueId}&itemId=${itemId}`
                    }
                    const pathToItem = `venues/${venueId}/items/${itemId}`
                    this.item$ = this.firestoreService.getDocument(pathToItem)
                })
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
