import { Action } from "@ngrx/store";




export const IS_LOADING = '[Ui] Is Loading';


export class SetIsLoading implements Action {
    readonly type = IS_LOADING;
    constructor(public isLoading: boolean) { }

}

export type UiActions = SetIsLoading;
