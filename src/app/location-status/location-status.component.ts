import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import { Venue } from '../admin/shared/models/venue.model';
import { Observable } from 'rxjs';
import { Item } from '../admin/shared/models/item.model';
import { LSC } from '../admin/shared/models/language-specific-content.model';

import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { VenuesService } from '../admin/venues/venues.service';
import { DocumentData } from '@angular/fire/firestore';

@Component({
    selector: 'app-location-status',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './location-status.component.html',
    styleUrls: ['./location-status.component.scss'],

})
export class LocationStatusComponent implements OnInit {

    venue: Venue;
    item: Item;
    lsc: LSC;
    venue$: Observable<DocumentData>;
    item$: Observable<Item>;
    lsc$: Observable<LSC>;
    innerHtmlVenueName: string;
    innerHtmlItemName: string;
    innerHtmlLSCLanguage: string

    constructor(
        private store: Store<fromRoot.State>,
        private router: Router,
        private venuesService: VenuesService

    ) { }

    ngOnInit(): void {

    }


    createInnerHtmlVenue(venueName: string) {
        if (venueName) {
            const html: string = `Selected Venue: ${venueName}</div>`
            this.innerHtmlVenueName = html
        } else {
            const html: string = null
            this.innerHtmlVenueName = html
        }
    }
    createInnerHtmlItem(itemName: string) {
        if (itemName) {
            const html: string = `Selected Item: ${itemName}`
            this.innerHtmlItemName = html
        } else {
            const html: string = null
            this.innerHtmlItemName = html
        }
    }
    createInnerHtmlLSC(language: string) {
        if (language) {
            const html: string = `Selected Language: ${language}`
            this.innerHtmlLSCLanguage = html
        } else {
            const html: string = null
            this.innerHtmlLSCLanguage = html
        }
    }
    onAllVenues() {
        this.router.navigateByUrl('/admin/venues')

    }
    onSelectedVenue() {
        console.log('onseledtedvenue')
        this.router.navigateByUrl('/admin/venue')

    }
    onSelectedItem() {
        this.router.navigateByUrl('/admin/item-details');
        this.store.dispatch(new ADMIN.SetAdminLanguage(null));
    }
}
