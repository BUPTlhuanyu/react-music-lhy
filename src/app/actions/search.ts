import * as types from './actionsTypes'
import { ISearchHistory, IActionCreator } from 'store/stateTypes'

export const setSearchHistory : IActionCreator = (searchHistory:ISearchHistory) => {
    return {
        type: types.SET_SEARCH_HISTORY,
        searchHistory
    }
}