import {playMode} from 'common/js/config'
import * as types from 'actions/actionsTypes'

export const playing = (state:boolean = false, action:any) => {
    switch(action.type){
        case types.SET_PLAYING_STATE:
            return action.playing
        default:
            return state
    }
}

export const fullScreen = (state:boolean = false, action:any) => {
    switch(action.type){
        case types.SET_FULL_SCREEN:
            return action.fullScreen
        default:
            return state
    }
}

export const playlist = (state:Array<any> = [], action:any) => {
    switch(action.type){
        case types.SET_PLAYLIST:
            return action.playlist
        default:
            return state
    }
}

export const sequenceList = (state:Array<any> = [], action:any) => {
    switch(action.type){
        case types.SET_SEQUENCE_LIST:
            return action.sequenceList
        default:
            return state
    }
}

export const mode = (state:number = playMode.sequence, action:any) => {
    switch(action.type){
        case types.SET_PLAY_MODE:
            return action.mode
        default:
            return state
    }
}

export const currentIndex = (state:number = -1, action:any) => {
    switch(action.type){
        case types.SET_CURRENT_INDEX:
            return action.currentIndex
        default:
            return state
    }
}