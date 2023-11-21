import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { User as FirebaseUser } from "@angular/fire/auth";
import { Observable, first, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from 'src/app/app.reducer';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import { Store } from '@ngrx/store';
import { DocumentData } from '@angular/fire/firestore';
import * as VISITOR from 'src/app/visitor/store/visitor.actions';
import * as NAVIGATION from './../store/navigation.actions'
import { VenuesService } from 'src/app/admin/venues/venues.service';
import { ItemsService } from 'src/app/admin/venues/venue/items/items.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LscsService } from 'src/app/admin/venues/venue/items/item/item-details/lscs/lscs.service';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { VenueIdItemId } from 'src/app/admin/shared/models/venueIdItemId';
import { SetMochucoActive } from '../store/navigation.actions';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

export interface Location {
    venueId: string;
    itemId: string;
    language: string;
}

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatIconModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Output() sidenavToggle = new EventEmitter<void>


    user$: Observable<FirebaseUser>;
    item$: Observable<DocumentData>
    venue$: Observable<DocumentData>;
    isMainPageActive$: Observable<boolean>;
    developerMode$: Observable<boolean>;
    isMainPageActive: boolean = false;
    isAdmin$: Observable<boolean>;
    mochucoActive: boolean = false;
    venuePresent$: Observable<DocumentData>;
    venueLogoUrl: string;

    venueId: string;
    visitorSelectedView$: Observable<string>
    visitorMainPageId$: Observable<string>





    constructor(
        private afAuth: Auth,
        private authService: AuthService,
        private store: Store<fromRoot.State>,
        private venuesService: VenuesService,
        private firestoreService: FirestoreService,
        private router: Router



    ) { }

    ngOnInit(): void {
        this.developerMode$ = this.store.select(fromRoot.getDeveloperMode)
        this.visitorMainPageId$ = this.store.select(fromRoot.getVisitorMainPageId);
        this.visitorSelectedView$ = this.store.select(fromRoot.getVisitorSelectedView)
        this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {
            this.venueId = venueId

            this.getVenueLogoUrl(venueId).then((venueLogoUrl: string) => {
                this.venueLogoUrl = venueLogoUrl
            })
        })

        this.isAdmin$ = this.store.select(fromRoot.getIsAdmin);


        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                this.user$ = new Observable<FirebaseUser>((subcriber: any) => {
                    subcriber.next(user)
                })
            } else {
                this.user$ = null;
            }
        })

        this.isAdmin$ = this.store.select(fromRoot.getIsAdmin)
    }

    onMochucoLogo() {

        this.store.dispatch(new VISITOR.SetVisitorSelectedView('mochuco'))
        this.router.navigateByUrl('scan-result');
    }


    emptyStore() {
        localStorage.removeItem('adminDataLS')
    }


    toItem() {
        this.store.dispatch(new VISITOR.SetVisitorSelectedView('item'))
        this.router.navigateByUrl('scan-result');
    }

    onToggleSidenav() {
        this.sidenavToggle.emit();
    }
    onLogIn() {
        this.router.navigateByUrl('auth/login')
    }
    onLogout() {

        this.authService.logout();
    }

    onDeveloperMode() {
        this.store.select(fromRoot.getDeveloperMode).pipe(first()).subscribe((developerMode: boolean) => {
            if (!developerMode) {
                this.store.dispatch(new NAVIGATION.SetDeveloperMode(true))
            } else {
                this.store.dispatch(new NAVIGATION.SetDeveloperMode(false))
            }
        })
    }
    onVenues() {
        this.store.dispatch(new ADMIN.SetAdminVenueId(null));
        this.store.dispatch(new ADMIN.SetAdminItemId(null));
        this.store.dispatch(new ADMIN.SetAdminLanguage(null));
    }
    onVenueLogo() {
        this.store.dispatch(new VISITOR.SetVisitorSelectedView('main-page'));
        this.router.navigateByUrl('scan-result');
    }


    getVenueLogoUrl(venueId) {
        const promise = new Promise((resolve, reject) => {
            const pathToVenue = `venues/${venueId}`
            this.firestoreService.getDocument(pathToVenue).subscribe((venue: Venue) => {
                resolve(venue.logoUrl);
            })

        })
        return promise
    }
}
