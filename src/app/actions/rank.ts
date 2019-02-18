import * as types from './actionsTypes'
import { ITopList, IActionCreator } from 'store/stateTypes'

export const setTopList : IActionCreator = (topList:ITopList) => {
    return {
        type: types.SET_TOP_LIST,
        topList
    }
}