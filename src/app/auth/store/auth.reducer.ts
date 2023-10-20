import {
    IS_ADMIN
} from "./auth.actions"


export interface AuthState {
    isAdmin: boolean;
}

let initialState: AuthState = {
    isAdmin: false
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
        default: {
            return state
        }
    }
}

export const getIsAdmin = (authState: AuthState) => authState.isAdmin;

