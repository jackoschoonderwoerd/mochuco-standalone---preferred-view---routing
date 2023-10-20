import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ScannerComponent } from './visitor/scanner/scanner.component';
import { HeaderComponent } from './navigation/header/header.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import * as fromRoot from './app.reducer';

import { State, Store } from '@ngrx/store';
import { LocationStatusComponent } from './location-status/location-status.component';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AdminDataLS } from './admin/shared/models/admin-data-ls.model';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from "@angular/fire/auth";
import { TestsComponent } from './admin/shared/tests/tests.component';
// import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { GoogleMapsModule } from '@angular/google-maps';
import { StoreData } from './admin/shared/models/store-data.model';
import { take } from 'rxjs'
import { LscsService } from './admin/venues/venue/items/item/item-details/lscs/lscs.service';
import { VenuesService } from './admin/venues/venues.service';
import { ItemsService } from './admin/venues/venue/items/items.service';
import { Venue } from './admin/shared/models/venue.model';

import * as VISITOR from 'src/app/visitor/store/visitor.actions'
import { Item } from './admin/shared/models/item.model';
import { LoginData } from './admin/shared/models/login-data.model';
import * as AUTH from './auth/store/auth.actions'
import { VenueIdItemId } from './admin/shared/models/venueIdItemId';
import * as NAVIGATION from 'src/app/navigation/store/navigation.actions';

import { VisitorService } from './visitor/visitor.service';
import { ScannerService } from './visitor/scanner/scanner.service';






@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ScannerComponent,
        HeaderComponent,
        FooterComponent,
        SidenavComponent,
        MatSidenavModule,
        LocationStatusComponent,
        TestsComponent,
        GoogleMapsModule


    ],
    providers: [
        //     {
        //     provide: NgxQRCodeModule
        // },

    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    DEFAULT_VIDEO_OPTIONS: MediaTrackConstraints = {
        facingMode: 'environment'

    };
    DEFAULT_MEDIA_TRACK_SETTINGS: MediaTrackSettings = {

    }
    sidenavOpen: boolean = false;
    title = 'mochuco-standalone';
    someoneIsLoggedIn: boolean = false
    devices: any;
    user$: Observable<FirebaseUser>
    minutesToExpiration: number = 10;

    constructor(
        private store: Store<fromRoot.State>,
        public afAuth: Auth,
        public route: ActivatedRoute,
        public router: Router,
        public venuesService: VenuesService,
        public itemsService: ItemsService,
        public lscsService: LscsService,
        public visitorService: VisitorService,
        private scannerService: ScannerService
    ) { }

    ngOnInit(): void {


        this.getIds();


        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                this.someoneIsLoggedIn = true;
                if (user.uid === 'DhwbsQYD4OVm2j7d5ZzZGiGoHXJ2') {
                    this.store.dispatch(new AUTH.SetIsAdmin(true));
                }
            } else {
                this.someoneIsLoggedIn = false;
            }
        })
        // this.setIds();

        this.updateLS();
    }

    private updateLS() {
        this.store.subscribe((storeData: StoreData) => {
            // console.log('updating ls', storeData);
            const now = new Date();
            const key = 'adminDataLS'
            const expirationTime = new Date(now.getTime() + this.minutesToExpiration * 60 * 1000);

            const adminDataLS: AdminDataLS = {
                adminState: storeData.admin,
                expirationTimeStamp: expirationTime.getTime()
            }
            localStorage.setItem(key, JSON.stringify(adminDataLS))
        })
    }

    private checkForLsExpiration() {
        const expirationDate = JSON.parse(localStorage.getItem('adminDataLS')).expirationTimeStamp;
        console.log(expirationDate)
        if (expirationDate < Date.now()) {
            localStorage.removeItem('adminDataLS')
            this.router.navigateByUrl('/auth/login')

        }
    }




    getIds() {


        const url = new URL(window.location.href);
        const queryParameters = url.searchParams;

        const venueId = queryParameters.get('venueId')
        const itemId = queryParameters.get('itemId')

        alert(`app.component itemId:  ${itemId}`)

        if (venueId && !itemId) {
            // alert(`app.component no itemId venueId: ${venueId}`)
            this.visitorService.storeMainPageItemId(venueId);
            this.scannerService.getNearestItemId(venueId).then((nearestItemId: string) => {
                this.store.dispatch(new VISITOR.SetVisitorItemId(nearestItemId))
            })
            this.visitorService.storeVisitorSelectedVenueId(venueId);

        }
        if (venueId && itemId) {
            alert(`app.component venueId: ${venueId}, itemId: ${itemId}`)
            // this.visitorService.storeMainPageItemId(venueId);
            this.visitorService.storeVisitorSelectedVenueId(venueId)
            this.visitorService.storeVisitorSelectedItemId(itemId)
            // this.store.dispatch(new VISITOR.SetVisitorItemId(itemId));
        }
        if (!venueId && !itemId) {
            alert('no venueId, no itemId')
            console.log('no venueId, no itemId')
        }


        const venueIdItemId: VenueIdItemId = {
            venueId,
            itemId
        }
        console.log(`app-component.ts getIds(){} ${venueIdItemId}`)

        if (venueIdItemId) {
            return {
                venueIdItemId
            }
        }
    }


    private getMediaConstraintsForDevice(deviceId: string, baseMediaTrackConstraints: MediaTrackConstraints) {
        const result: MediaTrackConstraints = baseMediaTrackConstraints ? baseMediaTrackConstraints : this.DEFAULT_VIDEO_OPTIONS;
        if (deviceId) {
            result.deviceId = { exact: deviceId };
        }
    }

}
