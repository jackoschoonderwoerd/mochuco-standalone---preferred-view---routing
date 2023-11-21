

import { AdminDataLS } from "../shared/models/admin-data-ls.model";
import { Item } from "../shared/models/item.model";
import { LSC } from "../shared/models/language-specific-content.model";
import { Venue } from "../shared/models/venue.model";
import {
    ADMIN_ITEM_ID,
    ADMIN_LANGUAGE,
    ADMIN_VENUE_ID,
    // IS_LOADING,
    // SELECTED_ITEM,
    // SELECTED_LSC,
    // SELECTED_VENUE
} from "./admin.actions"



export interface AdminState {
    // selectedVenue: Venue,
    // selectedItem: Item,
    // selectedLSC: LSC,

    adminVenueId: string
    adminItemId: string,
    adminLanguage: string

}

let initialState: AdminState = {
    // selectedVenue: null,
    // selectedItem: null,
    // selectedLSC: null,
    adminVenueId: null,
    adminItemId: null,
    adminLanguage: null

}

// export function setAdminStateFromLs(adminStateFromLS: AdminState) {
//     initialState = adminStateFromLS;
// }



export function adminReducer(state = initialState, action: any) {
    // const router = new Router
    if (localStorage.getItem('adminDataLS')) {
        const adminDataLS: AdminDataLS = JSON.parse(localStorage.getItem('adminDataLS'))
        // if (adminDataLS && adminDataLS.expirationTimeStamp > Date.now()) {
        if (adminDataLS) {

            state = adminDataLS.adminState
        } else {
            console.log('data persistance cancelled due to incativity');
            this.router.navigateByUrl('auth/login')
        }
    }
    switch (action.type) {
        // case SELECTED_VENUE: {
        //     // console.log(action)
        //     return {
        //         ...state,
        //         selectedVenue: action.venue
        //     }
        // }
        // case SELECTED_ITEM: {
        //     return {
        //         ...state,
        //         selectedItem: action.item,
        //     }
        // }
        // case SELECTED_LSC: {
        //     return {
        //         ...state,
        //         selectedLSC: action.lsc
        //     }
        // }
        case ADMIN_VENUE_ID: {
            return {
                ...state,
                adminVenueId: action.venueId
            }
        }
        case ADMIN_ITEM_ID: {
            return {
                ...state,
                adminItemId: action.itemId
            }
        }
        case ADMIN_LANGUAGE: {
            return {
                ...state,
                adminLanguage: action.language
            }
        }

        default: {
            return state
        }
    }
}


// export const getSelectedVenue = (adminState: AdminState) => adminState.selectedVenue;
// export const getSelectedItem = (adminState: AdminState) => adminState.selectedItem;
// export const getSelectedLSC = (adminState: AdminState) => adminState.selectedLSC;
export const getAdminVenueId = (adminState: AdminState) => adminState.adminVenueId;
export const getAdminItemId = (adminState: AdminState) => adminState.adminItemId;
export const getAdminLanguage = (adminState: AdminState) => adminState.adminLanguage;


