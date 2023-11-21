
import { Venue } from "src/app/admin/shared/models/venue.model";
import {

    VISITOR_SELECTED_LANGUAGE,

    VISITOR_MAIN_PAGE_ITEM_ID,
    VISITOR_VENUE_ID,
    VISITOR_ITEM_ID,
    VISITOR_SELECTED_ITEM,
    VISITOR_SELECTED_LSC
} from "./visitor.actions"
import { Item } from "src/app/admin/shared/models/item.model";
import { LSC } from "src/app/admin/shared/models/language-specific-content.model";

import { VISITOR_SELECTED_VIEW } from './visitor.actions';
import { visitAll } from "@angular/compiler";

export interface VisitorState {

    visitorSelectedLanguage: string;
    // visitorSelectedMainPage: Item;

    visitorMainPageId: string;
    visitorVenueId: string;
    visitorItemId: string;

    visitorSelectedView: string
    visitorSelectedItem: Item;
    visitorSelectedLsc: LSC;

    mochucoVenueId: string;
    mochucoItemId: string;
}

let initialState: VisitorState = {

    visitorSelectedLanguage: 'dutch',
    visitorMainPageId: '',
    visitorVenueId: 'BuGKIwQAD92zjMvUFCgE',
    visitorItemId: 'pSh9bg8LR8j0AdNYLt6i',
    visitorSelectedItem: null,
    visitorSelectedLsc: null,
    mochucoVenueId: 'BuGKIwQAD92zjMvUFCgE',
    mochucoItemId: 'pSh9bg8LR8j0AdNYLt6i',
    visitorSelectedView: 'item'



}

export function visitorReducer(state = initialState, action: any) {
    switch (action.type) {

        case VISITOR_SELECTED_LANGUAGE: {
            return {
                ...state,
                visitorSelectedLanguage: action.visitorSelectedLanguage
            }
        }
        case VISITOR_MAIN_PAGE_ITEM_ID: {

            //  console.log(action)

            console.log(action)

            return {
                ...state,
                visitorMainPageId: action.visitorMainPageItemId
            }
        }
        case VISITOR_VENUE_ID: {

            //  console.log(action)

            // console.log(action)

            return {
                ...state,
                visitorVenueId: action.visitorVenueId
            }
        }
        case VISITOR_ITEM_ID: {


            // console.log(action)

            return {
                ...state,
                visitorItemId: action.visitorItemId
            }
        }

        case VISITOR_SELECTED_VIEW: {
            console.log(action)
            return {
                ...state,
                visitorSelectedView: action.visitorSelectedView
            }
        }
        case VISITOR_SELECTED_ITEM: {
            return {
                ...state,
                visitorSelectedItem: action.visitorSelectedItem
            }
        }
        case VISITOR_SELECTED_LSC: {
            return {
                ...state,
                visitorSelectedLsc: action.visitorSelectedLsc
            }
        }


        default: {
            return state
        }
    }
}

export const getVisitorSelectedLanguage = (visitorState: VisitorState) => visitorState.visitorSelectedLanguage;

export const getVisitorMainPageId = (visitorState: VisitorState) => visitorState.visitorMainPageId;
export const getVisitorVenueId = (visitorState: VisitorState) => visitorState.visitorVenueId;
export const getVisitorItemId = (visitorState: VisitorState) => visitorState.visitorItemId;
export const getVisitorSelectedItem = (visitorState: VisitorState) => visitorState.visitorSelectedItem;
export const getVisitorSelectedLsc = (visitorState: VisitorState) => visitorState.visitorSelectedLsc;

export const getVisitorSelectedView = (visitorState: VisitorState) => visitorState.visitorSelectedView;


// export const getVisitorSelectedMainPage = (visitorState: VisitorState) => visitorState.visitorSelectedMainPage;
// export const getVisitorMainPageActive = (visitorState: VisitorState) => visitorState.visitorMainPageActive;
