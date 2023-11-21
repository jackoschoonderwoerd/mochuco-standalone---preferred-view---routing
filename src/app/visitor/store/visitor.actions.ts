import { Action } from "@ngrx/store";
import { Item } from "src/app/admin/shared/models/item.model";
import { LSC } from "src/app/admin/shared/models/language-specific-content.model";
import { Venue } from "src/app/admin/shared/models/venue.model";





export const VISITOR_SELECTED_LANGUAGE = '[Visitor] Selected Language';
export const VISITOR_MAIN_PAGE_ITEM_ID = '[Visitor] Main Page Item Id';
export const VISITOR_VENUE_ID = '[Visitor] Venue Id';
export const VISITOR_ITEM_ID = '[Visitor] Item Id';
export const MOCHUCO_ACTIVE = '[Visitor] Mochuco Active';
export const VISITOR_SELECTED_ITEM = '[Visitor] Visitor Selected Item';
export const VISITOR_SELECTED_LSC = '[Visitor] Visitor Selected Lsc';
export const VISITOR_SELECTED_VENUE = '[Visitor] Visitor Selected Venue;'

export const VISITOR_SELECTED_VIEW = '[Visitor] Selected View';




export class SetVisitorSelectedLanguage implements Action {
    readonly type = VISITOR_SELECTED_LANGUAGE;
    constructor(public visitorSelectedLanguage: string) { }
}
export class SetVisitorMainPageItemId implements Action {
    readonly type = VISITOR_MAIN_PAGE_ITEM_ID;
    constructor(public visitorMainPageItemId: string) { }
}
export class SetVisitorVenueId implements Action {
    readonly type = VISITOR_VENUE_ID;
    constructor(public visitorVenueId: string) { }
}
export class SetVisitorItemId implements Action {
    readonly type = VISITOR_ITEM_ID;
    constructor(public visitorItemId: string) { }
}
export class SetMochucoActive implements Action {
    readonly type = MOCHUCO_ACTIVE;
    constructor(public mochucoActive: boolean) { }
}
export class SetVisitorSelectedItem implements Action {
    readonly type = VISITOR_SELECTED_ITEM;
    constructor(public visitorSelectedItem: Item) { }
}
export class SetVisitorSelectedLsc implements Action {
    readonly type = VISITOR_SELECTED_LSC;
    constructor(public visitorSelectedLsc: LSC) { }
}
export class SetVisitorSelectedVenue implements Action {
    readonly type = VISITOR_SELECTED_VENUE;
    constructor(public visitorSelectedVenue: Venue) { }
}
export class SetVisitorSelectedView implements Action {
    readonly type = VISITOR_SELECTED_VIEW;
    constructor(public visitorSelectedView: string) { }
}








export type VisitorActions =
    SetVisitorSelectedLanguage |
    SetVisitorMainPageItemId |
    SetVisitorVenueId |
    SetVisitorItemId |

    SetMochucoActive |
    SetVisitorSelectedView

SetMochucoActive



