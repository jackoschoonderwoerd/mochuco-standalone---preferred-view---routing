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
            this.selectedVenue = { ...selectedVenue }
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                this.selectedItem = { ...selectedItem }
                if (this.selectedVenue && this.selectedVenue.id && this.selectedItem && this.selectedItem.id) {
                    this.qrDataString = `https://mochuco-standalone-ec3f0.web.app/?venueId=${this.selectedVenue.id}&itemId=${this.selectedItem.id}`
                    // this.qrDataString = `http://localhost:4200?venueId=${this.selectedVenue.id}&itemId=${this.selectedItem.id}`
                    // console.log(this.qrDataString)
                } else {
                    console.log('insufficient data');
                    this.insufficientDataForQr = true;
                }

            })
        })
    }
    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
    getWidth() {
        return document.body.offsetWidth / 5
    }
}
