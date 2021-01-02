import * as types from 'actions/actionsTypes';
import {
    IPlaying,
    IFullScreen,
    IPlaylist,
    ISequenceList,
    IMode,
    ICurrentIndex,
    defaultState,
    IAction
} from 'store/stateTypes';

export const playing = (state: IPlaying = defaultState.playing, action: IAction) => {
    switch (action.type) {
        case types.SET_PLAYING_STATE:
            return action.playing;
        default:
            return state;
    }
};

export const fullScreen = (state: IFullScreen = defaultState.fullScreen, action: IAction) => {
    switch (action.type) {
        case types.SET_FULL_SCREEN:
            return action.fullScreen;
        default:
            return state;
    }
};

export const playlist = (state: IPlaylist = defaultState.playlist, action: IAction) => {
    switch (action.type) {
        case types.SET_PLAYLIST:
            return action.playlist;
        default:
            return state;
    }
};

export const sequenceList = (state: ISequenceList = defaultState.sequenceList, action: IAction) => {
    switch (action.type) {
        case types.SET_SEQUENCE_LIST:
            return action.sequenceList;
        default:
            return state;
    }
};

export const mode = (state: IMode = defaultState.mode, action: IAction) => {
    switch (action.type) {
        case types.SET_PLAY_MODE:
            return action.mode;
        default:
            return state;
    }
};

export const currentIndex = (state: ICurrentIndex = defaultState.currentIndex, action: IAction) => {
    switch (action.type) {
        case types.SET_CURRENT_INDEX:
            return action.currentIndex;
        default:
            return state;
    }
};
