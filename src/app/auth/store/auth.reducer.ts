import {
    IS_ADMIN, IS_LOGGED_IN
} from "./auth.actions"


export interface AuthState {
    isAdmin: boolean;
    isLoggedIn: boolean
}

let initialState: AuthState = {
    isAdmin: false,
    isLoggedIn: false
}

export function authReducer(state = initialState, action: any) {
    switch (action.type) {
        case IS_ADMIN: {
            // console.log(action)
            return {
                ...state,
                isAdmin: action.isAdmin
            }
        }
        case IS_LOGGED_IN: {
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        }
        default: {
            return state
        }
    }
}

export const getIsAdmin = (authState: AuthState) => authState.isAdmin;
export const getIsLoggedIn = (authState: AuthState) => authState.isLoggedIn;

