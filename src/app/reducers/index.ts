import { combineReducers } from "redux";
import singer from './singer'
import * as player from './player'
import disc from './disc'
import topList from './rank'
import searchHistory from './search'

const reducer = combineReducers({
    singer:singer,
    playing:player.playing,
    fullScreen:player.fullScreen,
    playlist:player.playlist,
    sequenceList:player.sequenceList,
    mode:player.mode,
    currentIndex:player.currentIndex,
    disc: disc,
    topList:topList,
    searchHistory:searchHistory
})

export default reducer