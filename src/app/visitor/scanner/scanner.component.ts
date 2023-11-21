// https://github.com/id1945/ngx-scanner-qrcode/blob/master/src/app/app.component.ts
// https://github.com/id1945/ngx-scanner-qrcode#readme

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgxScannerQrcodeModule,  } from 'ngx-scanner-qrcode';
import {
    NgxScannerQrcodeModule,
    ScannerQRCodeConfig,

    NgxScannerQrcodeComponent,
    ScannerQRCodeSelectedFiles,

} from 'ngx-scanner-qrcode';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import * as VISITOR from 'src/app/visitor/store/visitor.actions';
import * as NAVIGATION from 'src/app/navigation/store/navigation.actions';





import { VenuesService } from 'src/app/admin/venues/venues.service';
import { ItemsService } from 'src/app/admin/venues/venue/items/items.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Observable } from 'rxjs';
import { ScannerService } from './scanner.service';
import { environment } from '../../../environments/environments.prod';
import { VenueIdItemId } from 'src/app/admin/shared/models/venueIdItemId';
import { LscsService } from '../../admin/venues/venue/items/item/item-details/lscs/lscs.service';

import { VisitorService } from '../visitor.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationOptionsComponent } from './location-options/location-options.component';
import * as ADMIN from 'src/app/admin/store/admin.actions';



@Component({
    selector: 'app-scanner',
    standalone: true,
    imports: [CommonModule, NgxScannerQrcodeModule],
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})

export class ScannerComponent implements AfterViewInit, OnInit {


    venueIdAmsterdamseSchool = 'uLTo5hk32u67P47GzYU4'
    itemIdBlokZeeburgerDijk = '1620kIHFkRVK3Kalbk5I';

    // videoHeight: '200px';
    // videoWidth:'200px';
    // camMode: 'environment'

    @ViewChild('scanner', { static: true }) scanner: any

    public config: ScannerQRCodeConfig = {
        constraints: {
            video: {
                width: window.innerWidth,
                // facingMode: { exact: "environment" },
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
    public isAdmin$: Observable<boolean>;

    @ViewChild('action') action!: NgxScannerQrcodeComponent;

    constructor(
        private router: Router,
        private store: Store<fromRoot.State>,

        private scannerService: ScannerService,
        private visitorService: VisitorService,

        private venuesService: VenuesService,
        private itemsService: ItemsService,
        // private qrCode: NgxScannerQrcodeService,

        private lscsService: LscsService,

        private dialog: MatDialog

    ) { }

    ngOnInit(): void {
        this.isAdmin$ = this.store.select(fromRoot.getIsAdmin);

        var constraints = {
            // video: {
            //     width: this.videoHeight, height: this.videoWidth, facingMode: this.camMode
            // }
            video: true
        };
        navigator.mediaDevices.getUserMedia({
            video: {
                width: 160,
                height: 150,
                facingMode: 'environment'
            }

        })
    }

    ngAfterViewInit(): void {
        // console.log(this.scanner)
        this.scanner.start();
        this.action.isReady.subscribe((res: any) => {
            // console.log(res);
            this.handle(this.action, 'start');
        });
    }
    onEvent(e: any[], action) {
        this.scanner.stop();
        const url = new URL(e[0].value)
        this.store.dispatch(new VISITOR.SetVisitorSelectedView('item'));
        const queryParameters = url.searchParams;
        const venueId = queryParameters.get('venueId');
        const itemId = queryParameters.get('itemId');
        const venueIdItemId: VenueIdItemId = {
            venueId: venueId,
            itemId: itemId
        }
        this.store.dispatch(new NAVIGATION.SetPreviousItemData(venueIdItemId));
        if (venueId && !itemId) {
            console.log('no itemId', venueId, itemId);
            this.scannerService.getMainPageItemId(venueId).then((mainPageItemId: string) => {
                this.store.dispatch(new VISITOR.SetVisitorMainPageItemId(mainPageItemId))
            })
            this.store.dispatch(new VISITOR.SetVisitorVenueId(venueId))
            // this.store.dispatch(new ADMIN.SetAdminVenueId(venueId))
            // return;
            // this.visitorService.storeMainPageItemId(venueId);

            this.scannerService.getNearestItemId(venueId)
                .then((nearestItemId: string) => {
                    console.log('nearestItemId', nearestItemId);
                    // this.visitorService.storeVisitorSelectedItemId(nearestItemId);
                    this.store.dispatch(new VISITOR.SetVisitorItemId(nearestItemId));
                })
                .catch((err: any) => {
                    console.error(err);
                })
        }
        if (venueId && itemId) {
            this.scannerService.getMainPageItemId(venueId).then((mainPageItemId: string) => {
                this.store.dispatch(new VISITOR.SetVisitorMainPageItemId(mainPageItemId))
            })
            // this.store.dispatch(new ADMIN.SetAdminVenueId(venueId))
            // this.visitorService.storeMainPageItemId(venueId);
            // this.visitorService.storeVisitorSelectedVenueId(venueId)
            this.store.dispatch(new VISITOR.SetVisitorVenueId(venueId))
            // this.visitorService.storeVisitorSelectedItemId(itemId)
            this.store.dispatch(new VISITOR.SetVisitorItemId(itemId));
        }

        if (!venueId && !itemId) {
            console.log('no venueId, no itemId')
        }

        this.router.navigateByUrl('/scan-result')
    }

    public handle(action: any, fn: string): void {
        const playDeviceFacingBack = (devices: any[]) => {
            // front camera or back camera check here!
            const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
            action.playDevice(device ? device.deviceId : devices[0].deviceId);
        }

        if (fn === 'start') {
            action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
        } else {
            action[fn]().subscribe((r: any) => console.log(fn, r), alert);
        }
    }
}
