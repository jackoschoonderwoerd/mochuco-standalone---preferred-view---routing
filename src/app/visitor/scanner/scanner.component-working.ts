// https://github.com/id1945/ngx-scanner-qrcode/blob/master/src/app/app.component.ts
// https://github.com/id1945/ngx-scanner-qrcode#readme

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgxScannerQrcodeModule,  } from 'ngx-scanner-qrcode';
import {
    NgxScannerQrcodeModule,
    ScannerQRCodeConfig,
    ScannerQRCodeResult,
    NgxScannerQrcodeService,
    NgxScannerQrcodeComponent,
    ScannerQRCodeSelectedFiles,
    LOAD_WASM
} from 'ngx-scanner-qrcode';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import * as VISITOR from 'src/app/visitor/store/visitor.actions'
import { VenuesService } from 'src/app/admin/venues/venues.service';
import { ItemsService } from 'src/app/admin/venues/venue/items/items.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';

@Component({
    selector: 'app-scanner',
    standalone: true,
    imports: [CommonModule, NgxScannerQrcodeModule],
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})

export class ScannerComponent implements AfterViewInit {

    @ViewChild('scanner', { static: true }) scanner: any


    public config: ScannerQRCodeConfig = {
        constraints: {
            video: {
                // width: window.innerWidth,
                // facingMode: 'user',
                facingMode: "environment",
            },
        },
        // canvasStyles: [
        //     {
        //         lineWidth: 1,
        //         fillStyle: '#00950685',
        //         strokeStyle: '#00950685',
        //     },
        //     {
        //         font: '17px serif',
        //         fillStyle: '#ff0000',
        //         strokeStyle: '#ff0000',
        //     }
        // ],
    };

    public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
    public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

    @ViewChild('action') action!: NgxScannerQrcodeComponent;

    constructor(
        private router: Router,
        private store: Store<fromRoot.State>,
        private venuesService: VenuesService,
        private itemsService: ItemsService,
        private qrCode: NgxScannerQrcodeService
    ) { }

    ngAfterViewInit(): void {
        console.log(this.scanner)
        this.scanner.start();
        // this.action.isReady.subscribe((res: any) => {
        //     console.log(res);
        //     this.handle(this.action, 'start');
        // });
    }
    onEvent(e: any[], action) {
        console.log(e[0].value)
        const link: string = e[0].value;
        console.log(link)
        const venueIdStart: number = link.indexOf('venueId=');
        const venueIdEnd: number = link.indexOf('&')
        const itemIdStart: number = link.indexOf('itemId=');

        const venueId: string = link.substring(venueIdStart + 8, venueIdEnd);
        console.log('venueId', venueId);
        this.venuesService.getVenueByVenueId(venueId).subscribe((visitorSelectedVenue: Venue) => {
            this.store.dispatch(new VISITOR.SetVisitorSelectedVenue(visitorSelectedVenue))
        })

        const itemId: string = link.substring(itemIdStart + 7)
        console.log('itemId', itemId);
        this.itemsService.getItemByItemId(venueId, itemId).subscribe((visitorSelectedItem: Item) => {
            console.log(visitorSelectedItem);
            this.store.dispatch(new VISITOR.SetVisitorSelectedItem(visitorSelectedItem))
        })
        this.router.navigateByUrl('/scan-result')
    }

    // public handle(action: any, fn: string): void {
    //     const playDeviceFacingBack = (devices: any[]) => {
    //         // front camera or back camera check here!
    //         const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
    //         action.playDevice(device ? device.deviceId : devices[0].deviceId);
    //     }

    //     if (fn === 'start') {
    //         action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    //     } else {
    //         action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    //     }
    // }
}
