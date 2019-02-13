import * as types from 'actions/actionsTypes'
import { loadSearch } from 'common/js/cache'

const searchHistory = (state:Array<any> = loadSearch(), action:any) => {
    switch(action.type){
        case types.SET_SEARCH_HISTORY:
            return action.searchHistory
        default:
            return state
    }
}

export default searchHistory