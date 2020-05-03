import React, {Component} from 'react'
import Scroll from 'src/app/components/scroll/Scroll'
import Loading from 'src/app/components/loading/Loading'
import SongList from 'src/app/components/song-list/SongList'
import './MusicList.scss'
import { connect } from 'react-redux'
import {
    setPlaying,
    setFullScreen,
    setSequenceList,
    setPlaylist,
    setCurrentIndex,
    setPlayMode
} from 'actions/player'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

import { Dispatch } from 'redux'
import {
    ISong ,
    IPlaying,
    ICurrentIndex,
    IMode,
    IPlaylist,
    ISequenceList,
    IFullScreen,
    IStoreState
} from 'store/stateTypes'

import {prefixStyle} from 'common/js/dom.js'
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

const RESERVED_HEIGHT = 40

interface MusicListProps{
    singerName: string,
    songs:Array<ISong>,
    bgImage:string,
    back:Function,
    setPlaying:Function,
    setFullScreen:Function,
    setSequenceList:Function,
    setPlaylist:Function,
    setCurrentIndex:Function,
    setPlayMode:Function,
    mode:number,
    playlist:IPlaylist,
    rank?:boolean
}

interface MusicListState{
    minTransalteY: number,
    imageHeight: number
}



class MusicList extends Component<MusicListProps, MusicListState>{
    bgImage : React.RefObject<HTMLDivElement>;
    list : React.RefObject<Scroll>;
    layer : React.RefObject<HTMLDivElement>;
    filter : React.RefObject<HTMLDivElement>;
    playBtn : React.RefObject<HTMLDivElement>;
    constructor(props:MusicListProps){
        super(props)
        this.bgImage = React.createRef();
        this.list = React.createRef();
        this.layer = React.createRef();
        this.filter = React.createRef();
        this.playBtn = React.createRef();
        this.state = {
            minTransalteY : 0,
            imageHeight: 0
        }
    }



    componentDidMount(){
        if(!this.bgImage.current || !this.list.current || !this.list.current.wrapper.current){
            return
        }
        let listTop = this.bgImage.current.clientHeight;
        this.list.current.wrapper.current.style.top = `${listTop}px`;
        this.setState({
            imageHeight: listTop,
            minTransalteY: -listTop + RESERVED_HEIGHT
        })
    }

    componentWillUnmount(){
        // console.log("musiclist componentWillUnmount")
    }

    scrollHandler = (pos : {x:number,y:number}) => {
        if(!this.bgImage.current || !this.layer.current || !this.playBtn.current || !this.filter.current){
            return
        }
        if(Object.is(pos.y,NaN)){
            return
        }
        let layer = this.layer.current;
        let bgImage = this.bgImage.current;
        let playBtn = this.playBtn.current;
        let newY = pos.y;
        let translateY = Math.max(this.state.minTransalteY, newY)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newY / this.state.imageHeight)
        if (newY > 0) {
            scale = 1 + percent
            zIndex = 10
        } else {
            blur = Math.min(20, percent * 20)
        }
        layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.filter.current.style[backdrop] = `blur(${blur}px)`
        if (newY < this.state.minTransalteY) {
            zIndex = 10
            bgImage.style.paddingTop = '0'
            bgImage.style.height = `${RESERVED_HEIGHT}px`
            playBtn.style.display = 'none'
        } else {
            bgImage.style.paddingTop = '70%'
            bgImage.style.height = '0'
            playBtn.style.display = ''
        }
        bgImage.style[transform] = `scale(${scale})`
        bgImage.style.zIndex = zIndex + ""
    }

    back = () => {
        this.props.back()
    }

    componentDidUpdate(){
        this.handlePlaylist(this.props.playlist)
    }

    handlePlaylist= (playlist:IPlaylist) => {
        let list =this.list.current
        if(!list){
            return
        }
        const bottom = playlist.length > 0 ? '60px' : ''
        list.wrapper.current && (list.wrapper.current.style.bottom = bottom)
        list.refresh()
    }

    findIndex = (list:ISequenceList, song:ISong) => {
        return list.findIndex((item) => {
            return item.id === song.id
        })
    }

    selectSong = (song: ISong, index: number) => {
        this.props.setSequenceList(this.props.songs)
        if (this.props.mode === playMode.random) {
            let randomList = shuffle(this.props.songs)
            this.props.setPlaylist(randomList)
            index = this.findIndex(randomList, this.props.songs[index])
        } else {
            this.props.setPlaylist(this.props.songs)
        }
        this.props.setPlaying(true)
        this.props.setFullScreen(true)
        this.props.setCurrentIndex(index)
    }

    random = () => {
        this.props.setPlayMode(playMode.random)
        this.props.setSequenceList(this.props.songs)
        let randomList = shuffle(this.props.songs)
        // console.log("randomList",randomList)
        this.props.setPlaylist(randomList)
        this.props.setFullScreen(true)
        this.props.setCurrentIndex(0)
        this.props.setPlaying(true)
    }

    render(){
        // console.log("MusicListBase",this.props)
        const { bgImage, songs, singerName } = this.props;
        const rank = this.props.rank || false;
        return (
            <div className="music-list">
                <div className="back" onClick={this.back}>
                    <i className="icon-back"/>
                </div>
                <h1 className="title">{singerName}</h1>
                <div className="bg-image" style={{backgroundImage:bgImage?`url(${bgImage})`:""}} ref={this.bgImage}>
                    {
                        !!songs.length &&
                        <div className="play-wrapper">
                            <div className="play" ref={this.playBtn} onClick={this.random}>
                                <i className="icon-play"/>
                                <span className="text">随机播放全部</span>
                            </div>
                        </div>
                    }
                    <div className="filter" ref={this.filter}></div>
                </div>
                <div className="bg-layer" ref={this.layer}></div>
                <Scroll className="list" probeType={3} ref={this.list} scrollHandler={this.scrollHandler}>
                    <div className="song-list-wrapper">
                        <SongList songs={songs} rank={rank} selectItem={this.selectSong}/>
                    </div>
                    {
                        !songs.length &&
                        <div className="loading-container">
                            <Loading/>
                        </div>
                    }
                </Scroll>
            </div>
        )
    }
}

const mapStateToProps = (state:IStoreState) => ({
    mode:state.mode,
    playlist:state.playlist
})

const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        setPlaying: (playing:IPlaying) => (
            dispatch(setPlaying(playing))
        ),
        setFullScreen: (fullScreen:IFullScreen) => (
            dispatch(setFullScreen(fullScreen))
        ),
        setSequenceList: (list:ISequenceList) => (
            dispatch(setSequenceList(list))
        ),
        setPlaylist: (list:IPlaylist) => (
            dispatch(setPlaylist(list))
        ),
        setCurrentIndex: (index:ICurrentIndex) => (
            dispatch(setCurrentIndex(index))
        ),
        setPlayMode: (mode:IMode) => {
            dispatch(setPlayMode(mode))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicList)