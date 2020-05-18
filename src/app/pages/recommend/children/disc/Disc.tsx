import './Disc.scss'

import React,{ Component, useState, useRef, useCallback } from 'react'
import { withRouter } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import { getSongList } from 'api/recommend.js'
import {ERR_OK} from 'api/config'

import MusicList from 'components/music-list/MusicList'
import {createSong} from 'common/js/song.js'
import { IDisc, ISong } from 'store/stateTypes'

import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount'

interface DiscBasePropType{
    disc:IDisc,
    history:any
}

const _normalizeSongs = function(list: Array<any>): ISong[]{
    Logger.green(list)
    let ret: ISong[]= []
    list.forEach((item) => {
        let musicData = item
        if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
        }
    })
    return ret
}


function DiscBase(props: DiscBasePropType){
    const [showMusicList, setShowMusicList] = useState<boolean>(true)
    const [songs, setSongs] = useState<Array<ISong>>([])

    const unmoutedFlag: React.MutableRefObject<boolean> = useRef(false)                   // 组件是否挂载

    const _getSongList = useCallback(() => {
        if (!props.disc.dissid) {
            props.history.push('/recommend')
            return
        }
        getSongList(props.disc.dissid).then((res) => {
            if (res.code === ERR_OK && !unmoutedFlag.current) {
                setSongs( _normalizeSongs(res.cdlist[0].songlist))
            }
        })
    }, [props.disc.dissid, props.history])

    useDidMountAndWillUnmount(() => {
        _getSongList()
        return () => {
            unmoutedFlag.current = true
        }
    })

    return (
        <CSSTransition
            in={showMusicList}
            timeout={500}
            classNames="disc-transition"
            appear={true}
            unmountOnExit
            onExited = { () => {
                props.history.goBack()
            } }
        >
            <MusicList singerName={props.disc.dissname} bgImage={props.disc.imgurl} songs={songs} back={() => {setShowMusicList(false)}}/>
        </CSSTransition>
    )
}

const mapStateToProps = (state:{disc:IDisc},ownProps:any) => (
    {
        disc:state.disc,
        ...ownProps
    }
)

const Disc = withRouter(connect(mapStateToProps)(DiscBase));

export default Disc