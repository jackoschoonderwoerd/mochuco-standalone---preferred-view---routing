import { Action } from '@ngrx/store'
import { VenueIdItemId } from 'src/app/admin/shared/models/venueIdItemId';

export const MOCHUCO_ACTIVE = '[Navigation] Mochuco Active';
export const PREVIOUS_ITEM_DATA = '[Navigation] Previous Item Data';
export const SET_MAIN_PAGE_DATA = '[Navigation] Set Main Page Ids';
export const MAIN_PAGE_ACTIVE = '[Navigation] Main Page Active';
export const DEVELOPER_MODE = '[Navigation] Developer Mode'


export class SetMochucoActive implements Action {
    readonly type = MOCHUCO_ACTIVE;
    constructor(public status: boolean) { }
}
export class SetMainPageActive implements Action {
    readonly type = MAIN_PAGE_ACTIVE;
    constructor(public mainPageActive: boolean) { }
}
export class SetPreviousItemData implements Action {
    readonly type = PREVIOUS_ITEM_DATA;
    constructor(public venueIdItemId: VenueIdItemId) { }
}
export class SetMainPageItemData implements Action {
    readonly type = SET_MAIN_PAGE_DATA;
    constructor(public venueIdItemId: VenueIdItemId) { }
}
export class SetDeveloperMode implements Action {
    readonly type = DEVELOPER_MODE;
    constructor(public developerMode: boolean) { }
}

export type NavigationActions =
    SetMochucoActive
    | SetPreviousItemData
    | SetMainPageItemData
    | SetMainPageActive
    | SetDeveloperMode
