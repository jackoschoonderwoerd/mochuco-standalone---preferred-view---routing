import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from 'src/app/admin/venues/venue/items/items.service';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LscsService } from '../../admin/venues/venue/items/item/item-details/lscs/lscs.service';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as VISITOR from 'src/app/visitor/store/visitor.actions'
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { MapComponent } from './map/map.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VenuesService } from 'src/app/admin/venues/venues.service';

@Component({
    selector: 'app-scan-result',
    standalone: true,
    imports: [CommonModule, MapComponent, MatProgressSpinnerModule],
    templateUrl: './scan-result.component.html',
    styleUrls: ['./scan-result.component.scss']
})
export class ScanResultComponent implements OnInit {

    visitorSelectedVenue: Venue;
    visitorSelecteItem: Item
    item$: Observable<DocumentData>
    lsc$: Observable<DocumentData>;
    items: Item[];
    mochucoVenueId: string = 'BuGKIwQAD92zjMvUFCgE';
    mochucoItemId: string = 'pSh9bg8LR8j0AdNYLt6i';
    language: string = 'dutch'

    constructor(


        private store: Store<fromRoot.State>,
        private router: Router,
        private lscsService: LscsService,
        private itemsService: ItemsService,
        private venuesService: VenuesService,


    ) { }
    ngOnInit(): void {
        this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {

            this.store.select(fromRoot.getVisitorItemId).subscribe((itemId: string) => {
                this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
                    this.item$ = this.itemsService.getItemByItemId(venueId, itemId)
                    this.lsc$ = this.lscsService.getLsc(venueId, itemId, language);
                });
            });
        });

        this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
            console.log(language)
            // this.language = language;
            this.store.select(fromRoot.getVisitorSelectedView).subscribe((view: string) => {
                console.log(view)
                if (view === 'mochuco') {
                    this.setupForMochuco()
                    console.log(this.language)
                    this.item$ = this.itemsService.getItemByItemId(this.mochucoVenueId, this.mochucoItemId);
                    this.lsc$ = this.lscsService.getLsc(this.mochucoVenueId, this.mochucoItemId, language)
                } else if (view === 'item') {
                    this.setupForItem()
                    this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {
                        this.store.select(fromRoot.getVisitorItemId).subscribe((itemId: string) => {
                            this.item$ = this.itemsService.getItemByItemId(venueId, itemId);
                            this.lsc$ = this.lscsService.getLsc(venueId, itemId, language);
                        })
                    })
                } else if (view === 'main-page') {
                    this.setupForMainPage()
                    this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {
                        this.store.select(fromRoot.getVisitorMainPageId).subscribe((mainPageItemId: string) => {
                            this.item$ = this.itemsService.getItemByItemId(venueId, mainPageItemId);
                            this.lsc$ = this.lscsService.getLsc(venueId, mainPageItemId, language)
                        })
                    })
                }
            })
        })
        // this.item$ = this.store.select(fromRoot.getVisitorSelectedItem)
        this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {
            this.store.select(fromRoot.getVisitorItemId).subscribe((itemId: string) => {
                this.item$ = this.itemsService.getItemByItemId(venueId, itemId)
                this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
                    this.lsc$ = this.lscsService.getLsc(venueId, itemId, language);
                })
            })
        })
        // this.lsc$ = this.store.select(fromRoot.getVisitorSelectedLsc);
        // this.store.dispatch(new VISITOR.SetVisitorActive(true));
    }

    setupForMochuco() {

    }
    setupForItem() {

    }
    setupForMainPage() {

    }

    getItems(visitorSelectedVenueId: string) {
        this.itemsService.getItems(visitorSelectedVenueId).subscribe((items: Item[]) => {
            this.items = items
            this.items.forEach((item: Item) => {
                console.log(item.name, item.metersFromVisitor)
                if (item.coordinates) {
                    // console.log(typeof item.coordinates.latitude);
                    // console.log(typeof item.coordinates.longitude);
                    this.getDistanceFromUser(item.coordinates.latitude, item.coordinates.longitude)
                        .subscribe((metersFromVisitor: number) => {
                            item.metersFromVisitor = metersFromVisitor
                            // console.log(item.name);
                            // console.log(metersFromVisitor);
                            this.items = this.items.sort((a: Item, b: Item) => {
                                return a.metersFromVisitor - b.metersFromVisitor
                            })
                            // this.store.dispatch(new VISITOR.SetVisitorSelectedItem(this.items[0]))
                        })
                }
            })
        })
    }



    private getDistanceFromUser(itemLatitude: number, itemLongitude: number) {

        const distanceToObject = new Observable(observer => {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                if (!position) {
                    this.router.navigate(['/user/user-error-page', { message: 'can\'t determinate users geolocation' }])
                } else {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    const distanceFromObject = this.distanceFromObject(userLat, userLon, itemLatitude, itemLongitude);
                    observer.next(distanceFromObject);
                    observer.complete();
                }
            })
        })

        return distanceToObject

    }


    distanceFromObject(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {  // generally used geo measurement function

        var R = 6378.137; // Radius of earth in KM
        var dLat = latVisitor * Math.PI / 180 - latObject * Math.PI / 180;
        var dLon = lonVisitor * Math.PI / 180 - lonObject * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latObject * Math.PI / 180) * Math.cos(latVisitor * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return Math.round(d * 1000); // meters
    }
}
