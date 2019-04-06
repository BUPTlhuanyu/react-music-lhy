import * as types from './actionsTypes'
import { IUserName, IActionCreator } from 'store/stateTypes'

export const setUserName : IActionCreator = (userName : IUserName) => {
    return {
        type : types.SET_USERNAME,
        userName
    }
}