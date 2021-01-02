import * as types from './actionsTypes';
import {IDisc, IActionCreator} from 'store/stateTypes';

export const setDisc: IActionCreator = (disc: IDisc) => {
    return {
        type: types.SET_DISC,
        disc
    };
};
