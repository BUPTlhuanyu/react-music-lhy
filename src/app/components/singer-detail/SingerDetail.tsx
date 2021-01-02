import React, {Component} from 'react';
import './singer-detail.scss';
import {CSSTransition} from 'react-transition-group';
import {getSingerDetail} from 'api/singer';
import {connect} from 'react-redux';
import {ERR_OK} from 'api/config';
import MusicList from 'components/music-list/MusicList';
import {createSong} from 'common/js/song.js';
import {withRouter} from 'react-router';

import {ISong, IStoreState, ISinger} from 'store/stateTypes';

interface singerDetailStateType {
    showMusicList: boolean;
    songs: ISong[];
}

interface singerDetailPropType {
    singer: ISinger;
    history: any;
    location: any;
    match: any;
}

class SingerDetailBase extends Component<singerDetailPropType, singerDetailStateType> {
    unmoutedFlag: boolean;
    constructor(props: singerDetailPropType) {
        super(props);
        this.unmoutedFlag = false;
        this.state = {
            showMusicList: true,
            songs: []
        };
    }

    back = () => {
        this.setState({
            showMusicList: false
        });
    };

    componentDidMount() {
        if (this.props.singer && this.props.singer.id < 0) {
            this.props.history.push('/singer');
            return;
        }
        this._getSingerDetail();
    }

    componentWillUnmount() {
        this.unmoutedFlag = true;
    }

    _getSingerDetail = () => {
        getSingerDetail(this.props.singer.id).then(res => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    songs: this._normalizeSongs(res.data.list)
                });
            }
        });
    };

    _normalizeSongs = (list: any[]) => {
        let ret: any = [];
        list.forEach(item => {
            let {musicData} = item;
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData));
            }
        });
        return ret;
    };

    render() {
        const {singer} = this.props;
        const {songs} = this.state;
        // console.log("singer detail",singer)
        return (
            <CSSTransition
                in={this.state.showMusicList}
                timeout={500}
                classNames="singer-detail-transition"
                appear
                onExited={() => {
                    this.props.history.goBack();
                }}
            >
                <MusicList singerName={singer.name} bgImage={singer.avatar} songs={songs} back={this.back} />
            </CSSTransition>
        );
    }
}

const mapStateToProps = (state: IStoreState) => ({
    singer: state.singer
});

const SingerDetail = withRouter(connect(mapStateToProps)(SingerDetailBase));

export default SingerDetail;
