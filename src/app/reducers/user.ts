import * as types from 'actions/actionsTypes';
import {IUserName, defaultState, IAction} from 'store/stateTypes';

const userName = (state: IUserName = defaultState.userName, action: IAction) => {
    switch (action.type) {
        case types.SET_USERNAME:
            return action.userName;
        default:
            return state;
    }
};

export default userName;
