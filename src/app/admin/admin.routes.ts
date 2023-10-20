import { Routes } from "@angular/router";
import { VenuesComponent } from "./venues/venues.component";
import { AddVenueComponent } from "./venues/venue/venue.component";
import { StatisticsComponent } from "./venues/venue/statistics/statistics.component";
import { ItemDetailsComponent } from "./venues/venue/items/item/item-details/item-details.component";
import { LscDetailsComponent } from "./venues/venue/items/item/item-details/lscs/lsc-details/lsc-details.component";
import { UserDataComponent } from "./user-data/user-data.component";

export const ADMIN_ROUTES: Routes = [
    { path: 'venues', component: VenuesComponent },
    { path: 'venue', component: AddVenueComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'item-details', component: ItemDetailsComponent },
    { path: 'lsc-details', component: LscDetailsComponent },
    { path: 'user-data', component: UserDataComponent }
]
