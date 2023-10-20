import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, first, take } from 'rxjs';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { LscsService } from 'src/app/admin/venues/venue/items/item/item-details/lscs/lscs.service';
import { ItemsService } from 'src/app/admin/venues/venue/items/items.service';
import { VenuesService } from 'src/app/admin/venues/venues.service';
import * as fromRoot from 'src/app/app.reducer';
import * as VISITOR from 'src/app/visitor/store/visitor.actions'
import { VisitorService } from '../visitor.service';

@Injectable({
    providedIn: 'root'
})
export class ScannerService {

    items: Item[];

    constructor(
        private venuesService: VenuesService,
        private itemsService: ItemsService,
        private lscsService: LscsService,
        private visitorService: VisitorService,
        private store: Store<fromRoot.State>,
        private router: Router
    ) { }

    storeVisitorSelectedVenue(venueId: string) {

        //  console.log(venueId);

        console.log(venueId);

        // this.venuesService.getVenueByVenueId(venueId).subscribe((visitorSelectedVenue: Venue) => {
        //     this.store.dispatch(new VISITOR.SetVisitorSelectedVenue(visitorSelectedVenue))
        // })
        this.router.navigateByUrl('scan-result')
    }

    // storeMainPage(venueId) {
    //     this.itemsService.getMainPageItem(venueId).subscribe((mainPageItemArray: Item[]) => {
    //         this.store.dispatch(new VISITOR.SetVisitorSelectedMainPage(mainPageItemArray[0]));
    //     })
    // }

    storeVisitorSelectedItem(venueId: string, itemId: string) {
        // this.itemsService.getItemByItemId(venueId, itemId).subscribe((visitorSelectedItem: Item) => {

        //     // //  console.log(visitorSelectedItem);
        //     this.store.dispatch(new VISITOR.SetVisitorSconsole.log(electedItem(visitorSelectedItem))

        //     // console.log(visitorSelectedItem);
        //     this.store.dispatch(new VISITOR.SetVisitorSelectedItem(visitorSelectedItem))

        // })
        // this.router.navigateByUrl('scan-result')
    }
    // storeVisitorSelectedLsc(venueId: string, itemId: string, visitorSelectedlanguage: string) {
    //     this.lscsService.storeLsc(venueId, itemId)
    // }


    // getNearestItemId(visitorSelectedVenueId: string) {
    //     const promise = new Promise((resolve, reject) => {

    //         let itemsWithMeters: Item[] = [];
    //         let sortedItems: Item[] = [];
    //         // this.store.dispatch(new VISITOR.SetVisitorMainPageActive(false))
    //         return this.itemsService.getItems(visitorSelectedVenueId).subscribe((items: Item[]) => {
    //             this.items = items;
    //             this.items.forEach((item: Item) => {
    //                 if (item.coordinates) {
    //                     // console.log('getAndSortItems', item.coordinates);
    //                     this.getMetersFromVisitor(item.coordinates.latitude, item.coordinates.longitude)
    //                         .subscribe((metersFromVisitor: number) => {
    //                             item.metersFromVisitor = metersFromVisitor
    //                             itemsWithMeters.push(item)
    //                             sortedItems = itemsWithMeters.sort((a: Item, b: Item) => {
    //                                 return a.metersFromVisitor - b.metersFromVisitor
    //                             });
    //                             // console.log(sortedItems);
    //                             // sortedItems.forEach((sortedItem: Item) => {
    //                             //     console.log(sortedItem.metersFromVisitor);
    //                             //     console.log(sortedItem.id, sortedItem.name);
    //                             // })
    //                             resolve(sortedItems[0].id)
    //                             // const nearestItem = sortedItems[0]
    //                             // this.store.dispatch(new VISITOR.SetVisitorSelectedView('item'))
    //                             // this.store.dispatch(new VISITOR.SetVisitorVenueId(visitorSelectedVenueId))
    //                             // this.store.dispatch(new VISITOR.SetVisitorItemId(nearestItem.id));
    //                             // this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
    //                             //     if (!language) {
    //                             //         this.store.dispatch(new VISITOR.SetVisitorSelectedLanguage('dutch'))
    //                             //         this.router.navigateByUrl('scan-result');
    //                             //     } else {
    //                             //         this.store.dispatch(new VISITOR.SetVisitorSelectedLanguage(language))
    //                             //         this.router.navigateByUrl('scan-result');
    //                             //     }
    //                             // })
    //                         })
    //                 }
    //             })
    //         })
    //     })
    //     return promise
    // }
    getNearestItemId(visitorSelectedVenueId: string) {
        console.log('visitorSelectedVenueId: ', visitorSelectedVenueId)
        let itemsWithMeters: Item[] = [];
        let sortedItems: Item[] = [];
        // this.store.dispatch(new VISITOR.SetVisitorMainPageActive(false))
        const promise = new Promise((resolve, reject) => {

            return this.itemsService.getItems(visitorSelectedVenueId).subscribe((items: Item[]) => {
                this.items = items
                this.items.forEach((item: Item) => {
                    if (item.coordinates) {
                        this.getMetersFromVisitor(item.coordinates.latitude, item.coordinates.longitude)
                            .subscribe((metersFromVisitor: number) => {
                                // console.log('metersFromVisitor', metersFromVisitor)
                                item.metersFromVisitor = metersFromVisitor
                                itemsWithMeters.push(item)
                                sortedItems = itemsWithMeters.sort((a: Item, b: Item) => {
                                    return a.metersFromVisitor - b.metersFromVisitor
                                });
                                const nearestItem = sortedItems[0]
                                if (nearestItem) {
                                    console.log('nearestItem: ', nearestItem)
                                    resolve(nearestItem.id)
                                } else {
                                    reject('nearest item not found')
                                }
                                // this.store.dispatch(new VISITOR.SetVisitorSelectedItem(sortedItems[0]))
                                this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
                                    this.lscsService.storeLsc(visitorSelectedVenueId, nearestItem.id)
                                })
                                this.router.navigateByUrl('scan-result');
                            })
                    }
                })
            })
        })
        return promise
    }




    private getMetersFromVisitor(itemLatitude: number, itemLongitude: number) {
        const metersFromItemObsevable = new Observable(observer => {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                if (!position) {
                    this.router.navigate(['/user/user-error-page', { message: 'can\'t determinate users geolocation' }])
                } else {
                    const visitorLatitude = position.coords.latitude;
                    const visitorLongitude = position.coords.longitude;
                    const metersFromItem = this.getMetersFromItem(visitorLatitude, visitorLongitude, itemLatitude, itemLongitude);
                    observer.next(metersFromItem);
                    observer.complete();
                }
            })
        })
        return metersFromItemObsevable
    }


    private getMetersFromItem(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {  // generally used geo measurement function
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
// https://mochuco-standalone-ec3f0.web.app/?venueId=uLTo5hk32u67P47GzYU4&itemId=m0GRp1o7hEgIPYuUD0r2
