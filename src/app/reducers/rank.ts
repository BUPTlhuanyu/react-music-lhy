import * as types from 'actions/actionsTypes';
import {ITopList, defaultState, IAction} from 'store/stateTypes';

const topList = (state: ITopList = defaultState.topList, action: IAction) => {
    switch (action.type) {
        case types.SET_TOP_LIST:
            return action.topList;
        default:
            return state;
    }
};

export default topList;
