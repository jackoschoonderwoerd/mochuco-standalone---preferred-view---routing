

import { IS_LOADING } from "./ui.actions"


export interface UiState {
    isLoading: boolean
}

const initialState: UiState = {
    isLoading: false
}

export function uiReducer(state = initialState, action: any) {
    switch (action.type) {
        case IS_LOADING: {
            // console.log(action);
            return {
                ...state,
                isLoading: action.isLoading
            }
        }
        default: {
            return state
        }
    }
}

export const getIsLoading = (uiState: UiState) => uiState.isLoading;
