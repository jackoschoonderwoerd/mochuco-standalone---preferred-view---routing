import { Action } from "@ngrx/store";
import { Venue } from "../shared/models/venue.model";
import { Item } from "../shared/models/item.model";
import { LSC } from "../shared/models/language-specific-content.model";



// export const SELECTED_VENUE = '[Admin] Selected Venue';
// export const SELECTED_ITEM = '[Admin] Selected Item';
// export const SELECTED_LSC = '[Admin] Selected LSC';
export const IS_LOADING = '[Admin] Is Loading';

export const ADMIN_VENUE_ID = '[Admin] Admin Venue Id';
export const ADMIN_ITEM_ID = '[Admin] Admin Item Id';
export const ADMIN_LANGUAGE = '[Admin] Admin Language'




// export class SetSelectedVenue implements Action {
//     readonly type = SELECTED_VENUE;
//     constructor(public venue: Venue) { }
// }

// export class SetSelectedItem implements Action {
//     readonly type = SELECTED_ITEM;
//     constructor(public item: Item) { }
// }
// export class SetSelectedLSC implements Action {
//     readonly type = SELECTED_LSC;
//     constructor(public lsc: LSC) { }
// }

export class SetIsLoading implements Action {
    readonly type = IS_LOADING;
    constructor(public isLoading: boolean) { }
}
export class SetAdminVenueId implements Action {
    readonly type = ADMIN_VENUE_ID;
    constructor(public venueId: string) { }
}

export class SetAdminItemId implements Action {
    readonly type = ADMIN_ITEM_ID;
    constructor(public itemId: string) { }
}
export class SetAdminLanguage implements Action {
    readonly type = ADMIN_LANGUAGE
    constructor(public language: string) { }
}



export type AdminActions =
    // SetSelectedVenue |
    // SetSelectedItem |
    // SetSelectedLSC |

    SetIsLoading |
    SetAdminVenueId |
    SetAdminItemId |
    SetAdminLanguage

