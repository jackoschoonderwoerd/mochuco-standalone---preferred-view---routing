import { LSC_NAME_DESCRIPTION_CHANGED } from "./lsc.actions"


export interface LscState {
    lscNameDescriptionChanged: boolean;

}

let initialState: LscState = {
    lscNameDescriptionChanged: false,


}



export function LSCReducer(state = initialState, action: any) {

    switch (action.type) {
        case LSC_NAME_DESCRIPTION_CHANGED: {
            console.log(action);
            return {
                ...state,
                lscNameDescriptionChanged: action.status
            }
        }
        default: {
            return state
        }
    }
}


export const getLSCNameDescriptionChanged = (lscState: LscState) => lscState.lscNameDescriptionChanged;



