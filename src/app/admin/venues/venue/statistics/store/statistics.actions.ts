import { Action } from "@ngrx/store";

export const ITEM_ID_STATISTICS = '[Stats] ItemId';

export class SetItemIdStatistics implements Action {
    readonly type = ITEM_ID_STATISTICS;
    constructor(public itemId: string) { }
}

export type StatisticsActions = SetItemIdStatistics;
