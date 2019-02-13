import * as types from './actionsTypes'

//     playing:player.playing,
//     fullScreen:player.fullScreen,
//     playlist:player.playlist,
//     sequenceList:player.sequenceList,
//     mode:player.mode,
//     currentIndex:player.currentIndex

export const setPlaying = (playing:boolean) => {
    return {
        type: types.SET_PLAYING_STATE,
        playing
    }
}

export const setFullScreen = (fullScreen:boolean) => {
    return {
        type: types.SET_FULL_SCREEN,
        fullScreen
    }
}

export const setPlaylist = (playlist:Array<any>) => {
    return {
        type: types.SET_PLAYLIST,
        playlist
    }
}

export const setSequenceList = (sequenceList:Array<any>) => {
    return {
        type: types.SET_SEQUENCE_LIST,
        sequenceList
    }
}

export const setPlayMode = (mode:number) => {
    return {
        type: types.SET_PLAY_MODE,
        mode
    }
}

export const setCurrentIndex = (currentIndex:number) => {
    return {
        type: types.SET_CURRENT_INDEX,
        currentIndex
    }
}
