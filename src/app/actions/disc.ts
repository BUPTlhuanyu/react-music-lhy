import * as types from './actionsTypes'

//     playing:player.playing,
//     fullScreen:player.fullScreen,
//     playlist:player.playlist,
//     sequenceList:player.sequenceList,
//     mode:player.mode,
//     currentIndex:player.currentIndex

export const setDisc = (disc:any) => {
    return {
        type: types.SET_DISC,
        disc
    }
}