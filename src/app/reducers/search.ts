import * as types from 'actions/actionsTypes'
import {
    ISearchHistory,
    defaultState,
    IAction
} from 'store/stateTypes'

const searchHistory = (state:ISearchHistory = defaultState.searchHistory, action:IAction) => {
    switch(action.type){
        case types.SET_SEARCH_HISTORY:
            return action.searchHistory
        default:
            return state
    }
}

export default searchHistory