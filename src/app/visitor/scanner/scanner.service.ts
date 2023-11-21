import { Injectable } from '@angular/core';
import { Item } from 'src/app/admin/shared/models/item.model';
import { ItemsService } from 'src/app/admin/venues/venue/items/items.service';
import { LocationOptionsComponent } from './location-options/location-options.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { VisitorBearings } from 'src/app/admin/shared/models/visitor-bearings.model.';
import { VisitorErrorPageComponent } from '../visitor-error-page/visitor-error-page.component';
import * as fromRoot from 'src/app/app.reducer';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';



@Injectable({
    providedIn: 'root'
})
export class ScannerService {

    items: Item[];
    developperMode: boolean = true;

    constructor(
        private itemsService: ItemsService,
        private store: Store<fromRoot.State>,
        private router: Router,
        private dialog: MatDialog,
        private firestoreService: FirestoreService
    ) { }

    storeVisitorSelectedVenue(venueId: string) {
        console.log(venueId);
        this.router.navigateByUrl('scan-result')
    }


    getNearestItemId(visitorSelectedVenueId: string) {
        console.log(visitorSelectedVenueId)
        const promise = new Promise((resolve, reject) => {
            this.getVisitorBearings()
                .then((visitorBearings: VisitorBearings) => {
                    this.getItemsWithCoordinates(visitorSelectedVenueId)
                        .then((itemsWithCoordinates: Item[]) => {
                            this.getNearest(visitorBearings, itemsWithCoordinates).then((nearestItemId: string) => {
                                console.log('nearestItemId: ', nearestItemId);
                                resolve(nearestItemId)
                            })
                        })
                })
        })
        return promise
    }

    getMainPageItemId(venueId: string) {
        const pathToItems = `venues/${venueId}/items`;
        const promise = new Promise((resolve, reject) => {
            this.firestoreService.getCollection(pathToItems).subscribe((items: Item[]) => {
                const mainPageItemsArray = items.filter((item: Item) => {
                    return item.isMainPage
                })
                const mainPageItemId = mainPageItemsArray[0].id
                resolve(mainPageItemId);
            })
        })
        return promise
    }

    private getVisitorBearings() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getDeveloperMode).subscribe((developerMode: boolean) => {
                if (developerMode) {
                    const dialogRef = this.dialog.open(LocationOptionsComponent)
                    dialogRef.afterClosed().subscribe((itemData: VisitorBearings) => {
                        resolve(itemData)
                    })
                } else {
                    if (navigator) {
                        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                            const itemData: VisitorBearings = {
                                name: 'auto generated',
                                coordinates: {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                }
                            }
                            resolve(itemData)
                        })
                    } else {
                        this.dialog.open(VisitorErrorPageComponent, {
                            data: {
                                message: 'no navigator'
                            }
                        })
                    }
                }
            })
        })
        return promise
    }

    private getItemsWithCoordinates(venueId: string) {
        const promise = new Promise((resolve, reject) => {
            const itemsWithCoordinates: Item[] = []
            const path = `venues/${venueId}/items`
            this.firestoreService.getCollection(path).pipe(take(1)).subscribe((items: Item[]) => {
                items.forEach((item: Item) => {
                    if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
                        itemsWithCoordinates.push(item);
                    }
                })
                resolve(itemsWithCoordinates)
            })
        })
        return promise
    }

    private getNearest(visitorBearings: VisitorBearings, itemsWithCoordinates: Item[]): Promise<any> {
        const itemsWithMetersToVisitorBearings: Item[] = []
        console.log('itemsWithCoordinates: ', itemsWithCoordinates);
        console.log('visitorBearings: ', visitorBearings)
        const promise = new Promise((resolve, reject) => {
            itemsWithCoordinates.forEach((itemWithCoordinates: Item) => {
                this.getMetersFromVisitor(
                    visitorBearings.coordinates.latitude,
                    visitorBearings.coordinates.longitude,
                    itemWithCoordinates.coordinates.latitude,
                    itemWithCoordinates.coordinates.longitude
                ).then((metersFormVisitorBearings: number) => {
                    itemWithCoordinates.metersFromVisitor = metersFormVisitorBearings
                    itemsWithMetersToVisitorBearings.push(itemWithCoordinates)
                    console.log('itemsWithCoordinates.length: ', itemsWithCoordinates.length)
                    console.log('itemsWithMetersToVisitorBearings.length: ', itemsWithMetersToVisitorBearings.length)
                    if (itemsWithCoordinates.length === itemsWithMetersToVisitorBearings.length) {
                        console.log(itemsWithMetersToVisitorBearings)
                        const sortedItemsWithMetersToVisitorBearings = itemsWithMetersToVisitorBearings.sort((a: Item, b: Item) => {
                            return a.metersFromVisitor - b.metersFromVisitor
                        })
                        resolve(sortedItemsWithMetersToVisitorBearings[0].id)
                    }
                })
            })
        })
        return promise
    }


    private getMetersFromVisitor(latVisitor: number, lonVisitor: number, latObject: number, lonObject: number) {
        const promise = new Promise((resolve, reject) => {
            if (this.developperMode) {
                console.log('this.developperMode: ', this.developperMode)
                const metersFromItem = this.getDistanceBetweenLocations(
                    latObject,
                    lonObject,
                    latVisitor,
                    lonVisitor,
                );
                resolve(metersFromItem)
            } else if (navigator) {

                navigator.geolocation.getCurrentPosition((geolocationPosition: GeolocationPosition) => {
                    const metersFromItem = this.getDistanceBetweenLocations(
                        latObject,
                        lonObject,
                        geolocationPosition.coords.latitude,
                        geolocationPosition.coords.longitude
                    )
                    resolve(metersFromItem);
                })
            }
        })
        return promise
    }

    private getDistanceBetweenLocations(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {  // generally used geo measurement function
        // console.log('latObject:', latObject, 'lonObject:', lonObject, 'latVisitor: ', latVisitor, 'lonVisitor: ', lonVisitor)
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

