import * as types from './actionsTypes';
import {ISinger, IActionCreator} from 'store/stateTypes';

export const setSinger: IActionCreator = (singer: ISinger) => {
    return {
        type: types.SET_SINGER,
        singer
    };
};
