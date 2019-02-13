import * as types from './actionsTypes'
import SingerClass from 'common/js/singer.js'

export const setSinger = (singer:SingerClass) => {
    return {
        type: types.SET_SINGER,
        singer
    }
}