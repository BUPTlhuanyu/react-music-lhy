import React,{ Component } from 'react'
import './singer-detail.scss'
import { CSSTransition } from 'react-transition-group'
import { getSingerDetail } from 'api/singer'
import { connect } from 'react-redux'
import SingerClass from 'common/js/singer.js'
import {ERR_OK} from 'api/config'
import MusicList from 'components/music-list/MusicList'
import {createSong} from 'common/js/song.js'
import { withRouter } from 'react-router'

interface singerDetailStateType{
    showMusicList: boolean,
    songs:Array<any>
}

interface singerDetailPropType{
    singer:SingerClass,
    history:any,
    location:any,
    match:any
}


class SingerDetailBase extends Component<singerDetailPropType, singerDetailStateType>{
    unmoutedFlag:boolean;
    constructor(props:singerDetailPropType){
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
        this._getSingerDetail()
    }

    componentWillUnmount(){
        this.unmoutedFlag=true
    }

    _getSingerDetail = () => {
        getSingerDetail(this.props.singer.id).then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    songs: this._normalizeSongs(res.data.list)
                })
            }
        })
    }

    _normalizeSongs = (list:Array<any>) => {
        let ret:any= []
        list.forEach((item) => {
            let {musicData} = item
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
        })
        return ret
    }

    render(){
        const { singer } = this.props;
        const { songs } = this.state;
        // console.log("singer detail",singer)
        return(
            <CSSTransition
                in={this.state.showMusicList}
                timeout={500}
                classNames="singer-detail-transition"
                appear={true}
                unmountOnExit
                onExited = { () => {
                    this.props.history.goBack()
                } }
            >
                <MusicList singerName={singer.name} bgImage={singer.avatar} songs={songs} back={this.back}/>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state:any) => (
    {
        singer:state.singer
    }
)

const SingerDetail = withRouter(connect(mapStateToProps)(SingerDetailBase));

export default SingerDetail