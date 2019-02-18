import * as types from './actionsTypes'
import {
    IPlaying,
    IFullScreen,
    IPlaylist,
    ISequenceList,
    IMode,
    ICurrentIndex,
    IActionCreator
}from 'store/stateTypes'

export const setPlaying : IActionCreator = (playing:IPlaying) => {
    return {
        type: types.SET_PLAYING_STATE,
        playing
    }
}

export const setFullScreen : IActionCreator = (fullScreen:IFullScreen) => {
    return {
        type: types.SET_FULL_SCREEN,
        fullScreen
    }
}

export const setPlaylist : IActionCreator = (playlist:IPlaylist) => {
    return {
        type: types.SET_PLAYLIST,
        playlist
    }
}

export const setSequenceList : IActionCreator = (sequenceList:ISequenceList) => {
    return {
        type: types.SET_SEQUENCE_LIST,
        sequenceList
    }
}

export const setPlayMode : IActionCreator = (mode:IMode) => {
    return {
        type: types.SET_PLAY_MODE,
        mode
    }
}

export const setCurrentIndex : IActionCreator = (currentIndex:ICurrentIndex) => {
    return {
        type: types.SET_CURRENT_INDEX,
        currentIndex
    }
}
