import { VenueIdItemId } from "src/app/admin/shared/models/venueIdItemId";
import { DEVELOPER_MODE, MAIN_PAGE_ACTIVE, MOCHUCO_ACTIVE, PREVIOUS_ITEM_DATA, SET_MAIN_PAGE_DATA } from "./navigation.actions"


export interface NavigationState {
    mochucoActive: boolean;
    venueIdItemId: VenueIdItemId;
    mainPageItemData: VenueIdItemId;
    mainPageActive: boolean;
    developerMode: boolean;
}

let initialState: NavigationState = {
    mochucoActive: false,
    venueIdItemId: null,
    mainPageItemData: null,
    mainPageActive: false,
    developerMode: false
}

export function navigationReducer(state = initialState, action: any) {
    switch (action.type) {
        case MOCHUCO_ACTIVE: {
            console.log(action)
            return {
                ...state,
                mochucoActive: action.status
            }
        }
        case PREVIOUS_ITEM_DATA: {
            return {
                ...state,
                venueIdItemId: action.venueIdItemId
            }
        }
        case SET_MAIN_PAGE_DATA: {
            return {
                ...state,
                mainPageItemData: action.mainPageItemData
            }
        }
        case MAIN_PAGE_ACTIVE: {
            return {
                ...state,
                mainPageActive: action.mainPageActive
            }
        }
        case DEVELOPER_MODE: {
            return {
                ...state,
                developerMode: action.developerMode
            }
        }
        default: {
            return state
        }
    }
}

export const getMochucoActive = (navigationState: NavigationState) => navigationState.mochucoActive;
export const getPreviousItemData = (navigationState: NavigationState) => navigationState.venueIdItemId;
export const getMainPageItemData = (navigationState: NavigationState) => navigationState.mainPageItemData;
export const getMainPageActive = (navigationState: NavigationState) => navigationState.mainPageActive;
export const getDeveloperMode = (navigationState: NavigationState) => navigationState.developerMode;
