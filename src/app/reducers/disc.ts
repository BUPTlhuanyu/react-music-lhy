import * as types from 'actions/actionsTypes'
import { IDisc, defaultState, IAction } from 'store/stateTypes'

const disc = (state:IDisc=defaultState.disc, action:IAction) => {
    switch(action.type){
        case types.SET_DISC:
            return action.disc
        default:
            return state
    }
}

export default disc