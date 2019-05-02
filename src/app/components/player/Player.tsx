import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    setFullScreen,
    setPlaying,
    setCurrentIndex,
    setPlayMode,
    setPlaylist,
    setSequenceList
} from 'actions/player'
import ProgressBar from 'reuse/progress-bar/ProgressBar'
import ProgressCircle from 'reuse/progress-circle/ProgressCircle'
import Scroll from 'reuse/scroll/Scroll'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import {prefixStyle} from 'common/js/dom'
import PlayList from 'components/playlist/PlayList'

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
import { Dispatch } from 'redux'
import {addFavorite,deleteFavorite} from 'api/favorite.js'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

import './player.scss'
import { IUserName } from 'store/stateTypes'
import { withRouter } from 'react-router'


interface PlayerPropType{
    history:any,
    location:any,
    match:any,
    fullScreen : IFullScreen,
    playlist : IPlaylist,
    currentIndex : ICurrentIndex,
    setFullScreen:Function,
    setPlaying:Function,
    setCurrentIndex:Function,
    setPlayMode:Function,
    setPlaylist:Function,
    setSequenceList:Function,
    playing:IPlaying,
    mode:IMode,
    sequenceList:ISequenceList,
    userName:IUserName
}

interface PlayerStateType{
    songReady:boolean,
    currentTime:number,
    currentSong:ISong,
    radius:number,
    currentLyric:any,
    playingLyric:string,
    currentLineNum:number,
    currentShow:string,
    favorite:boolean
}

let currentIndex:number;
let currentId:number;

class Player extends Component<PlayerPropType, PlayerStateType>{
    static getDerivedStateFromProps(props:any){
        const newId = props.playlist[props.currentIndex] && props.playlist[props.currentIndex].id;
        if(newId !== currentId){
            return {
                favorite:false,
                songReady:false,
                currentSong:props.playlist[props.currentIndex]
            }
        }
        return {}
    }
    audio:React.RefObject<HTMLAudioElement>;
    lyricList:React.RefObject<Scroll>;
    lyricLine:React.RefObject<HTMLDivElement>;
    middleL:React.RefObject<HTMLDivElement>;
    playlist:React.RefObject<PlayList>;
    touch:{
        initiated:boolean,
        startX:number,
        startY:number,
        percent:number
    };
    constructor(props: PlayerPropType){
        super(props)
        this.audio = React.createRef();
        this.lyricList = React.createRef();
        this.lyricLine = React.createRef();
        this.middleL = React.createRef();
        this.playlist = React.createRef();
        this.touch = {
            initiated:false,
            startX:0,
            startY:0,
            percent:0
        }
        this.state ={
            songReady: false,
            currentTime:0,
            currentSong: props.playlist[props.currentIndex],
            radius:32,
            currentLyric:null,
            playingLyric:'',
            currentLineNum:0,
            currentShow:'cd',
            favorite:false
        }
    }

    toggleFavorite(item:any){
        if(!this.state.songReady || !this.audio.current){
            return
        }
        console.log("this.state.songReady",this.state.songReady)
        if (!this.props.userName) {
            this.props.setFullScreen(false)
            this.props.history.push('/user')
            return
        }
        console.log('可以判断当前歌曲是否存在于喜欢的歌曲列表中来决定这里favorite状态，建议直接在render中判断，尽量避免使用getDerivedStateFromProps')
        let data = Object.assign(
            {},
            {
                userName:this.props.userName,
                mid:'',
                singer:'',
                name:'',
                album:'',
                duration:0,
                image:'',
                url:''
            },
            item
        )
        if(!this.state.favorite){
            addFavorite(data).then((data)=>{
                    if(data.success){
                        this.setState({
                            favorite:true
                        })
                    }
                }
            )
        }else{
            deleteFavorite(data).then((data)=>{
                console.log(data)
                    if(data.success){
                        this.setState({
                            favorite:false
                        })
                    }
                }
            )
        }
    }

    componentDidMount(){
        // this.setState({
        //     currentTime:this.audio.current.currentTime,
        //     currentSong:this.props.playlist[this.props.currentIndex]
        // })
    }

    getLyric = () => {
        if(this.state.currentLyric){
            this.state.currentLyric.stop()
        }

        this.state.currentSong.getLyric().then((lyric:string) => {
            if (this.state.currentSong.lyric !== lyric) {
                return
            }
            this.setState({
                currentLyric:new Lyric(lyric, this.handleLyric)
            },() => {
                if (!this.props.playing) {
                    this.state.currentLyric.play()
                }
                // console.log(this.state.currentLyric)
            })
        }).catch(() => {
            this.setState({
                currentLyric : null ,
                playingLyric:'',
                currentLineNum:0
            })
        })
    }

    handleLyric = ({lineNum, txt}:{lineNum:number, txt:string}) => {
        // console.log("handleLyric run")
        // console.log("lineNum",lineNum)
        // console.log("txt",txt)
        if(!this.lyricList.current || !this.lyricLine.current)return
        this.setState({
            currentLineNum:lineNum,
            playingLyric:txt
        })
        if (lineNum > 5) {
            let lineEl = this.lyricLine.current.childNodes[lineNum - 5]
            this.lyricList.current.scrollToElement(lineEl, 500)
        } else {
            this.lyricList.current.scrollTo(0, 0, 500)
        }
    }

    back : React.MouseEventHandler<HTMLDivElement> = () => {
        this.props.setFullScreen(false)
    }

    //播放
    open : React.MouseEventHandler<HTMLDivElement>= () => {
        this.props.setFullScreen(true)
    }

    prev : React.MouseEventHandler<HTMLElement>= () => {
        if (!this.state.songReady) {
            return
        }
        if (this.props.playlist.length === 1) {
            this.loop()
            return
        } else {
            let index = this.props.currentIndex - 1
            if (index === -1) {
                index = this.props.playlist.length - 1
            }
            this.props.setCurrentIndex(index)
            if (!this.props.playing) {
                this.togglePlaying()
            }
        }
    }

    next = () => {
        if (!this.state.songReady) {
            return
        }
        if (this.props.playlist.length === 1) {
            // console.log("this.props.playlist.length === 1")
            this.loop()
            return
        } else {
            let index = this.props.currentIndex + 1
            if (index === this.props.playlist.length) {
                index = 0
            }
            this.props.setCurrentIndex(index)
            if (!this.props.playing) {
                this.togglePlaying()
            }
        }
    }

    //时间
    updateTime : React.ReactEventHandler<HTMLAudioElement>= (e) => {
        const { currentTime } : { currentTime: number } = e.target as HTMLMediaElement;
        this.setState({
            currentTime : currentTime
        })
    }

    format= (interval:number = 0) => {
        //取整
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
    }
    _pad = (num:number, n:number = 2) =>{
        let len = num.toString().length
        let res = num + "";
        while (len < n) {
            res = '0' + res
            len++
        }
        return res
    }

    percent = () => {
        return this.state.currentTime / (this.state.currentSong && this.state.currentSong.duration)
    }

    //进度条
    onProgressBarChange = (percent: number) => {
        if(!this.audio.current){return}
        const currentTime = this.state.currentSong.duration * percent
        // console.log("this.audio.current",this.audio.current.currentTime)
        this.audio.current.currentTime = currentTime
        if (this.props.playing) {
            this.togglePlaying()
        }
        if (this.state.currentLyric) {
            this.state.currentLyric.seek(currentTime * 1000)
        }
    }

    //资源下载后自动播放
    canPlayHandler : React.ReactEventHandler<HTMLAudioElement> = () => {
        if(this.state.songReady){
            return
        }
        // console.log("canPlayHandler")
        currentId = this.state.currentSong.id;
        this.getLyric()
        this.setState({
            songReady: true
        },()=>{
            this.playHandler()
        })
    }

    disableCls = () => {
        return this.state.songReady ? '' : 'disable'
    }

    playHandler = () => {
        if(!this.state.songReady || !this.audio.current){
            return
        }
        const audio = this.audio.current;
        if(this.props.playing){
            audio.play()
        }else{
            audio.pause()
        }
        this.props.setPlaying(!this.props.playing)
    }

    togglePlaying  = () => {
        this.playHandler()
        if (this.state.currentLyric) {
            this.state.currentLyric.togglePlay()
        }
    }

    toggleMiniPlaying : React.MouseEventHandler<HTMLElement>= (e) => {
        e.stopPropagation();
        this.togglePlaying()
    }

    cdCls = () => {
        return this.props.playing ? 'play pause':'play'
    }

    playIcon = () => {
        return this.props.playing ? 'icon-play' : 'icon-pause'
    }

    miniIcon = () => {
        return this.props.playing ? 'icon-play-mini':'icon-pause-mini'
    }

    //mode
    changeMode = () => {
        const mode = (this.props.mode + 1) % 3
        this.props.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
            list = shuffle(this.props.sequenceList)
        } else {
            list = this.props.sequenceList
        }
        this.resetCurrentIndex(list)
        this.props.setPlaylist(list)
    }

    resetCurrentIndex = (list:Array<any>)=> {
        let index = list.findIndex((item) => {
            return item.id === this.state.currentSong.id
        })
        this.props.setCurrentIndex(index)
    }

    iconMode = () => {
        return this.props.mode === playMode.sequence ? 'icon-sequence' : this.props.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }

    end  = () => {
        if(!this.audio.current)return
        if (this.props.mode === playMode.loop) {
            this.audio.current.play()
            if (this.state.currentLyric) {
                this.state.currentLyric.seek(0)
            }
        } else {
            this.next()
        }
    }

    loop = () => {
        if(!this.audio.current)return
        this.audio.current.currentTime = 0
        this.playHandler()
        if (this.state.currentLyric) {
            this.state.currentLyric.seek(0)
        }
    }

    middleTouchStart:React.TouchEventHandler<HTMLDivElement> = (e) => {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
    }

    middleTouchMove :React.TouchEventHandler<HTMLDivElement> = (e) => {
        if (!this.touch.initiated || !this.lyricList.current || !this.middleL.current || !this.lyricList.current.wrapper.current) {
            return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return
        }
        const left = this.state.currentShow === 'cd' ? 0 : - window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.lyricList.current.wrapper.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.lyricList.current.wrapper.current.style[transitionDuration] = '0'
        this.middleL.current.style.opacity = 1 - this.touch.percent + ""
        this.middleL.current.style[transitionDuration] = '0'
    }

    middleTouchEnd  = () => {
        if (!this.lyricList.current || !this.middleL.current || !this.lyricList.current.wrapper.current) {
            return
        }
        let offsetWidth
        let opacity
        if (this.state.currentShow === 'cd') {
            if (this.touch.percent > 0.1) {
                offsetWidth = -window.innerWidth
                opacity = 0
                this.setState({
                    currentShow:'lyric'
                })
            } else {
                offsetWidth = 0
                opacity = 1
            }
        } else {
            if (this.touch.percent < 0.9) {
                offsetWidth = 0
                this.setState({
                    currentShow:'cd'
                })
                opacity = 1
            } else {
                offsetWidth = -window.innerWidth
                opacity = 0
            }
        }
        const time = 300
        this.lyricList.current.wrapper.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.lyricList.current.wrapper.current.style[transitionDuration] = `${time}ms`
        this.middleL.current.style.opacity = opacity + ""
        this.middleL.current.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
    }

    showPlaylist : React.MouseEventHandler<HTMLDivElement> = (e) => {
        if(!this.playlist.current)return
        e.stopPropagation();
        this.playlist.current.show()
    }

    modeText = () => {
        return this.props.mode === playMode.sequence ? '顺序播放' : this.props.mode === playMode.random ? '随机播放' : '单曲循环'
    }

    //playlist组件：歌曲列表删除，歌曲删除
    deleteSongList = () => {
        this.props.setCurrentIndex(-1)
        this.props.setPlaylist([])
        this.props.setSequenceList([])
        this.props.setPlaying(false)
    }

    findIndex = (list:ISequenceList, song:ISong) => {
        return list.findIndex((item) => {
            return item.id === song.id
        })
    }

    deleteSong = (song:ISong) => {
        let playlist = this.props.playlist.slice()
        let sequenceList = this.props.sequenceList.slice()
        let currentIndex = this.props.currentIndex
        let pIndex = this.findIndex(playlist, song)
        playlist.splice(pIndex, 1)
        let sIndex = this.findIndex(sequenceList, song)
        sequenceList.splice(sIndex, 1)
        if (currentIndex > pIndex || currentIndex === playlist.length) {
            currentIndex--
        }

        this.props.setCurrentIndex(currentIndex)
        this.props.setPlaylist(playlist)
        this.props.setSequenceList(sequenceList)

        if (!playlist.length) {
            this.props.setPlaying(false)
        } else {
            this.props.setPlaying(true)
        }
    }

    selectItem = (item:ISong, index:number) => {
        if (this.props.mode === playMode.random) {
            index = this.props.playlist.findIndex((song) => {
                return song.id === item.id
            })
        }
        this.props.setCurrentIndex(index)
        this.props.setPlaying(true)
    }

    getCurrentIcon = (item:ISong) => {
        if (this.state.currentSong && this.state.currentSong.id === item.id) {
            return 'icon-play'
        }
        return ''
    }

    scrollToCurrent = (scroller:any, scrollSon:NodeList,current:ISong = this.state.currentSong) => {
        const index = this.props.sequenceList.findIndex((song) => {
            return current.id === song.id
        })
        scroller.scrollToElement(scrollSon[index], 300)
    }

    render(){
        const { fullScreen, playlist } = this.props;
        const { currentTime,
                currentSong,
                radius,
                currentLyric,
                currentLineNum,
                playingLyric,
                currentShow,
                favorite } = this.state
        const styleDisplay = playlist.length ? 'block' : 'none';
        return (
            <div className="player" style={{display: `${styleDisplay}`}}>
                <div className="normal-player" style={{display: `${fullScreen? 'block' : 'none'}`}}>
                    <div className="background">
                        <img width="100%" height="100%" src={currentSong && currentSong.image}/>
                    </div>
                    <div className="top">
                        <div className="back" onClick={this.back}>
                            <i className="icon-back"/>
                        </div>
                        <h1 className="title" >{currentSong && currentSong.name}</h1>
                        <h2 className="subtitle">{currentSong && currentSong.singer}</h2>
                    </div>
                    <div className="middle"
                        onTouchStart={this.middleTouchStart}
                         onTouchMove={this.middleTouchMove}
                         onTouchEnd={this.middleTouchEnd}
                    >
                        <div className="middle-l" ref={this.middleL}>
                            <div className="cd-wrapper">
                                <div className={this.cdCls()+" cd"} >
                                    <img className="image" src={currentSong && currentSong.image}/>
                                </div>
                            </div>
                            <div className="playing-lyric-wrapper">
                                <div className="playing-lyric">{playingLyric}</div>
                            </div>
                        </div>
                        <Scroll className="middle-r" ref={this.lyricList} >
                            <div className="lyric-wrapper">
                                {
                                    currentLyric &&
                                    <div ref={this.lyricLine}>
                                        {
                                            currentLyric.lines.map((line:{txt:string},index:number) => (
                                                    <p className={"text" + (currentLineNum === index ? " current":"")}
                                                       key={index}
                                                    >
                                                        {line.txt}
                                                    </p>
                                                )
                                            )
                                        }
                                    </div>
                                }
                            </div>
                        </Scroll>
                    </div>
                    <div className="bottom">
                        <div className="dot-wrapper">
                            <span className={"dot" + (currentShow === 'cd' ? " active": "")}/>
                            <span className={"dot" + (currentShow === 'lyric' ? " active": "")}/>
                        </div>
                        <div className="progress-wrapper">
                            <span className="time time-l">{this.format(currentTime)}</span>
                            <div className="progress-bar-wrapper">
                                <ProgressBar percent={this.percent()} onProgressBarChange={this.onProgressBarChange}/>
                            </div>
                            <span className="time time-r">{this.format(currentSong && currentSong.duration)}</span>
                        </div>
                        <div className="operators">
                            <div className="icon i-left" >
                                <i className={this.iconMode()} onClick={this.changeMode}/>
                            </div>
                            <div className = {this.disableCls()+" icon i-left"}>
                                <i className="icon-prev" onClick={this.prev}/>
                            </div>
                            <div className={this.disableCls()+" icon i-center"}>
                                <i onClick={this.togglePlaying} className={this.playIcon()}/>
                            </div>
                            <div className={this.disableCls()+" icon i-right"}>
                                <i className="icon-next" onClick={this.next}/>
                            </div>
                            <div className={this.disableCls()+" icon i-right"} >
                                <i className={favorite?"icon-favorite":"icon-not-favorite"} onClick={()=>{this.toggleFavorite(currentSong)}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mini-player" style={{display: `${!fullScreen? 'flex' : 'none'}`}} onClick={this.open}>
                    <div className="icon">
                        <img width="40" height="40" src={currentSong && currentSong.image} className={this.cdCls()}/>
                    </div>
                    <div className="text">
                        <h2 className="name" >{currentSong && currentSong.name}</h2>
                        <p className="desc">{currentSong && currentSong.singer}</p>
                    </div>
                    <div className="control" style={{position:"relative"}}>
                        <ProgressCircle percent={this.percent()} radius={radius}>
                            <i className= {this.miniIcon()+" icon-mini"} onClick={this.toggleMiniPlaying} />
                        </ProgressCircle>
                    </div>
                    <div className="control"
                         onClick={this.showPlaylist}
                    >
                        <i className="icon-playlist"/>
                    </div>
                </div>
                <PlayList
                    ref={this.playlist}
                    toggleFavorite={()=>{console.log("todo，歌曲的favorite信息应该存在store中")}}
                    changeMode={this.changeMode}
                    iconMode={this.iconMode}
                    modeText={this.modeText}
                    deleteSongList={this.deleteSongList}
                    deleteSong={this.deleteSong}
                    sequenceList={this.props.sequenceList}
                    getCurrentIcon={this.getCurrentIcon}
                    selectItem={this.selectItem}
                    scrollToCurrent={this.scrollToCurrent}
                />
                <audio
                    ref={this.audio}
                    src={currentSong && currentSong.url}
                    onCanPlay={this.canPlayHandler}
                    onTimeUpdate={this.updateTime}
                    onEnded={this.end}
                />
            </div>
        )
    }
}

const mapStateToProp = (state:IStoreState,ownProps:any) => ({
    fullScreen : state.fullScreen,
    playlist : state.playlist,
    currentIndex : state.currentIndex,
    playing:state.playing,
    mode:state.mode,
    sequenceList:state.sequenceList,
    userName : state.userName,
    ...ownProps
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
    setFullScreen: (fullScreen: IFullScreen) => {
        dispatch(setFullScreen(fullScreen))
    },
    setPlaying: (playing: IPlaying) => {
        dispatch(setPlaying(playing))
    },
    setCurrentIndex: (index: ICurrentIndex) => {
        dispatch(setCurrentIndex(index))
    },
    setPlayMode: (mode:IMode) => {
        dispatch(setPlayMode(mode))
    },
    setPlaylist: (list:IPlaylist) => {
        dispatch(setPlaylist(list))
    },
    setSequenceList: (list:ISequenceList) => {
        dispatch(setSequenceList(list))
    }
})

export default withRouter(connect(mapStateToProp, mapDispatchToProps)(Player))