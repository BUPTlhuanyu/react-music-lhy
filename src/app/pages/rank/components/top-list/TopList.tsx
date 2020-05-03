import React,{ Component } from 'react'
import './TopList.scss'
import { CSSTransition } from 'react-transition-group'
import { getMusicList } from 'api/rank.js'
import { connect } from 'react-redux'
import {ERR_OK} from 'api/config'
import MusicList from 'components/music-list/MusicList'
import { createSong } from 'common/js/song.js'
import { withRouter } from 'react-router'

import {
    ISong,
    IStoreState,
    ITopList
} from 'store/stateTypes'

interface DiscBaseStateType{
    showMusicList: boolean,
    songs:Array<any>
}

interface DiscBasePropType{
    topList:ITopList,
    history:any
}


class TopList extends Component<DiscBasePropType, DiscBaseStateType>{
    unmoutedFlag:boolean;
    constructor(props:DiscBasePropType){
        super(props)
        this.unmoutedFlag=false
        this.state  = {
            showMusicList: true,
            songs:[]
        }
    }

    back = () => {
        this.setState({
            showMusicList:false
        })
    }

    componentDidMount(){
        if(this.props.topList && this.props.topList.id < 0){
            this.props.history.push('/rank')
            return
        }
        this._getMusicList()
    }

    componentWillUnmount(){
        this.unmoutedFlag=true
    }


    _getMusicList() {
        if (!this.props.topList.id) {
            this.props.history.push('/rank')
            return
        }
        getMusicList(this.props.topList.id).then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    songs:this._normalizeSongs(res.songlist)
                })
            }
        })
    }

    _normalizeSongs = (list:Array<any>) => {
        let ret:any= []
        list.forEach((item) => {
            let musicData = item.data
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
        })
        return ret
    }


    render(){
        const { topList } = this.props;
        const { songs } = this.state;
        const bgImage = songs[0] && songs[0].image
        return(
            <CSSTransition
                in={this.state.showMusicList}
                timeout={500}
                classNames="top-list-transition"
                appear={true}
                unmountOnExit
                onExited = { () => {
                     this.props.history.goBack()
                } }
            >
                <MusicList rank={true} singerName={topList.topTitle} bgImage={bgImage} songs={songs} back={this.back}/>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state:IStoreState,ownProps:any) => (
    {
        topList:state.topList,
        ...ownProps
    }
)


export default withRouter(connect(mapStateToProps)(TopList))