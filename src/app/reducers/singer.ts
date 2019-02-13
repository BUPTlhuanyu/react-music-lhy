import * as types from 'actions/actionsTypes'
import SingerClass from 'common/js/singer.js'

const singer = (state:any=new SingerClass({
    id : undefined,
    name: ""
}), action:any) => {
    switch(action.type){
        case types.SET_SINGER:
            return action.singer
        default:
            return state
    }
}

export default singer