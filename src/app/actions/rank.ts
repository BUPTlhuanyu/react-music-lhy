import * as types from './actionsTypes'

export const setTopList = (topList:any) => {
    return {
        type: types.SET_TOP_LIST,
        topList
    }
}