import { ITEM_ID_STATISTICS } from "./statistics.actions"

export interface StatisticsState {
    itemId: string
}

let initialState: StatisticsState = {
    itemId: null
}

export function statisticsReducer(state = initialState, action: any) {
    switch (action.type) {
        case ITEM_ID_STATISTICS: {
            console.log(action)
            return {
                ...state,
                itemId: action.itemId
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

export const getItemIdStatistics = (statisticsState: StatisticsState) => statisticsState.itemId
