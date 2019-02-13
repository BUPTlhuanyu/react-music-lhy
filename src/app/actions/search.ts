import * as types from './actionsTypes'

export const setSearchHistory = (searchHistory:string) => {
    return {
        type: types.SET_SEARCH_HISTORY,
        searchHistory
    }
}