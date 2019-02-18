import * as types from 'actions/actionsTypes'
import {
    ISinger,
    defaultState,
    IAction
} from 'store/stateTypes'

const singer = (state:ISinger=defaultState.singer, action:IAction) => {
    switch(action.type){
        case types.SET_SINGER:
            return action.singer
        default:
            return state
    }
}

export default singer