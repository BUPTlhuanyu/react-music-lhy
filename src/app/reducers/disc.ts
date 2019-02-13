import * as types from 'actions/actionsTypes'

const disc = (state:any={}, action:any) => {
    switch(action.type){
        case types.SET_DISC:
            return action.disc
        default:
            return state
    }
}

export default disc