import { Action } from "@ngrx/store";



export const LSC_NAME_DESCRIPTION_CHANGED = '[Languages] LSC Name Description Changed';
// export const LSC_DESCRIPTION = '[Languages] LSC Description';
// export const SELECTED_LSC = '[Admin] Selected LSC';


export class LSCNameDescriptionChanged implements Action {
    readonly type = LSC_NAME_DESCRIPTION_CHANGED;
    constructor(public status: boolean) { }
}
// export class LSCDescription implements Action {
//     readonly type = LSC_DESCRIPTION;
//     constructor(public description: string) { }
// }





export type lscActions = LSCNameDescriptionChanged;

