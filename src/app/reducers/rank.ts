import * as types from 'actions/actionsTypes'

const topList = (state:any={}, action:any) => {
    switch(action.type){
        case types.SET_TOP_LIST:
            return action.topList
        default:
            return state
    }
}

export default topList