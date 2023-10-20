import { Action } from "@ngrx/store";
import { Item } from "src/app/admin/shared/models/item.model";
import { Venue } from "src/app/admin/shared/models/venue.model";

export const IS_ADMIN = '[Admin] Is Admin';

export class SetIsAdmin implements Action {
    readonly type = IS_ADMIN;
    constructor(public isAdmin: boolean) { }
}


export type AdminActions =
    SetIsAdmin

