/* global Logger */
import './Disc.scss';

import React, {useState, useRef, useCallback} from 'react';
import {CSSTransition} from 'react-transition-group';

import {getSongList} from 'api/recommend.js';
import {ERR_OK} from 'api/config';

import MusicList from 'components/music-list/MusicList';
import {createSong} from 'common/js/song.js';
import {ISong} from 'store/stateTypes';
import {DiscPropType} from './type';

import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount';

const _normalizeSongs = function (list: any[]): ISong[] {
    let ret: ISong[] = [];
    list.forEach(item => {
        let musicData = item;
        if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
        }
    });
    return ret;
};

function Disc(props: DiscPropType) {
    // if (!props.disc) {
    //     return null;
    // }
    const [showMusicList, setShowMusicList] = useState<boolean>(true);
    const [songs, setSongs] = useState<ISong[]>([]);

    const unmoutedFlag: React.MutableRefObject<boolean> = useRef(false); // 组件是否挂载

    const _getSongList = useCallback(() => {
        Logger.blue('props.disc');
        if (!props.disc || !props.disc.dissid) {
            return;
        }
        getSongList(props.disc.dissid).then(res => {
            if (res.code === ERR_OK && !unmoutedFlag.current) {
                setSongs(_normalizeSongs(res.cdlist[0].songlist));
            }
        });
    }, [props.disc]);

    useDidMountAndWillUnmount(() => {
        Logger.red('Disc');
        _getSongList();
        return () => {
            unmoutedFlag.current = true;
        };
    });

    return (
        <CSSTransition
            in={showMusicList}
            timeout={500}
            classNames="disc-transition"
            appear
            unmountOnExit
            onExited={() => {
                props.back();
            }}
        >
            <MusicList
                singerName={props.disc ? props.disc.dissname : ''}
                bgImage={props.disc ? props.disc.imgurl : ''}
                songs={songs}
                back={() => {
                    setShowMusicList(false);
                }}
            />
        </CSSTransition>
    );
}

export default Disc;
