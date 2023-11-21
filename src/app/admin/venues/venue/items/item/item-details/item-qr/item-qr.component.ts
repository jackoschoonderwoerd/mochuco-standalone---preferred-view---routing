import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

@Component({
    selector: 'app-item-qr',
    standalone: true,
    imports: [CommonModule, QRCodeModule, MatButtonModule],
    templateUrl: './item-qr.component.html',
    styleUrls: ['./item-qr.component.scss'],


})


export class ItemQrComponent implements OnInit {
    logoPath: string = ''

    qrDataString: string
    selectedVenue: Venue;
    selectedItem: Item;
    innerWidth: number;
    insufficientDataForQr: boolean = false
    item$: Observable<DocumentData>;


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
            this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                this.qrDataString = `https://mochuco-standalone-ec3f0.web.app/?venueId=${venueId}&itemId=${itemId}`
                const pathToItem = `venues/${venueId}/items/${itemId}`
                this.item$ = this.firestoreService.getDocument(pathToItem)
            })
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
