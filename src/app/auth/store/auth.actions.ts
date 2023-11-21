import { Action } from "@ngrx/store";
import { Item } from "src/app/admin/shared/models/item.model";
import { Venue } from "src/app/admin/shared/models/venue.model";

export const IS_ADMIN = '[Admin] Is Admin';
export const IS_LOGGED_IN = '[Admin] Is Logged In'

export class SetIsAdmin implements Action {
    readonly type = IS_ADMIN;
    constructor(public isAdmin: boolean) { }
}
export class SetIsLoggedIn implements Action {
    readonly type = IS_LOGGED_IN;
    constructor(public isLoggedIn: boolean) {

    }
}


export type AdminActions =
    SetIsAdmin |
    SetIsLoggedIn

