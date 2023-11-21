import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAdmin from './admin/store/admin.reducer';
import * as fromUi from './admin/shared/ui.reducer';
import * as fromVisitor from './visitor/store/visitor.reducer';
import * as fromLSC from './admin/venues/venue/items/item/item-details/lscs/store/lsc.reducer'
import * as fromAuth from './auth/store/auth.reducer';

import * as fromNavigation from './navigation/store/navigation.reducer';
import * as fromStatistics from './admin/venues/venue/statistics/store/statistics.reducer'




export interface State {
    admin: fromAdmin.AdminState;
    ui: fromUi.UiState;
    visitor: fromVisitor.VisitorState;
    lsc: fromLSC.LscState;
    auth: fromAuth.AuthState;

    navigation: fromNavigation.NavigationState;
    statistics: fromStatistics.StatisticsState



}

export const reducers: ActionReducerMap<State> = {
    admin: fromAdmin.adminReducer,
    ui: fromUi.uiReducer,
    visitor: fromVisitor.visitorReducer,
    lsc: fromLSC.LSCReducer,
    auth: fromAuth.authReducer,

    navigation: fromNavigation.navigationReducer,
    statistics: fromStatistics.statisticsReducer




}

export function setStateFromLs(stateFormLs: State) {
    // console.log(stateFormLs)
    reducers.admin
}

export const getAdminState = createFeatureSelector<fromAdmin.AdminState>('admin');
// export const getSelectedVenue = createSelector(getAdminState, fromAdmin.getSelectedVenue);
// export const getSelectedItem = createSelector(getAdminState, fromAdmin.getSelectedItem);
// export const getSelectedLSC = createSelector(getAdminState, fromAdmin.getSelectedLSC);
export const getAdminVenueId = createSelector(getAdminState, fromAdmin.getAdminVenueId);
export const getAdminItemId = createSelector(getAdminState, fromAdmin.getAdminItemId);
export const getAdminLanguage = createSelector(getAdminState, fromAdmin.getAdminLanguage);



export const getUiState = createFeatureSelector<fromUi.UiState>('ui')
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getVisitorState = createFeatureSelector<fromVisitor.VisitorState>('visitor');
export const getVisitorSelectedLanguage = createSelector(getVisitorState, fromVisitor.getVisitorSelectedLanguage);
export const getVisitorMainPageId = createSelector(getVisitorState, fromVisitor.getVisitorMainPageId);
export const getVisitorVenueId = createSelector(getVisitorState, fromVisitor.getVisitorVenueId);
export const getVisitorItemId = createSelector(getVisitorState, fromVisitor.getVisitorItemId);

export const getVisitorSelectedView = createSelector(getVisitorState, fromVisitor.getVisitorSelectedView);




export const getLSCState = createFeatureSelector<fromLSC.LscState>('lsc');
export const getLSCNameDescriptionChanged = createSelector(getLSCState, fromLSC.getLSCNameDescriptionChanged);
// export const getLSCDescription = createSelector(getLSCState, fromLSC.getLSCDescription);

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getIsAdmin = createSelector(getAuthState, fromAuth.getIsAdmin);
export const getIsLoggedIn = createSelector(getAuthState, fromAuth.getIsLoggedIn)
// getLSCNameDescriptionChanged

export const getNavigationState = createFeatureSelector<fromNavigation.NavigationState>('navigation');
export const getMochucoActive = createSelector(getNavigationState, fromNavigation.getMochucoActive);
export const getPreviousItemData = createSelector(getNavigationState, fromNavigation.getPreviousItemData);
export const getMainPageItemData = createSelector(getNavigationState, fromNavigation.getMainPageItemData);
export const getMainPageActive = createSelector(getNavigationState, fromNavigation.getMainPageActive);
export const getDeveloperMode = createSelector(getNavigationState, fromNavigation.getDeveloperMode);


export const getStatisticsState = createFeatureSelector<fromStatistics.StatisticsState>('statistics');
export const getItemIdStatistics = createSelector(getStatisticsState, fromStatistics.getItemIdStatistics);


