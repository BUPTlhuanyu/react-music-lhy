enum playMode {
    sequence = 0,
    loop = 1,
    random = 2
}

export interface IDisc {
    commit_time: string;
    createtime: string;
    creator: any;
    dissid: string;
    dissname: string;
    imgurl: string;
    introduction: string;
    listennum: number;
    score: number;
    version: number;
};

export type ICurrentIndex = number;

export type IFullScreen = boolean;

export type IMode = playMode;

export type IPlaying = boolean;

export interface ISong {
    id: number;
    mid: string;
    singer: string;
    name: string;
    album: string;
    duration: number;
    image: string;
    url: string;
    getLyric: (mid?: string) => any;
    lyric: string;
};

export type IPlaylist = ISong[];

export type ISearchHistory = string[];

export type ISequenceList = ISong[];

export interface ISinger {
    id: number;
    name: string;
    avatar: string;
};

export interface ISongListItem {
    singername: string;
    songname: string;
};

export interface ITopList {
    id: number;
    listenCount: number;
    picUrl: string;
    songList: ISongListItem[];
    topTitle: string;
    type: number;
};

export type IUserName = string;

// ******** store state ********* //

export interface IStoreState {
    currentIndex: ICurrentIndex;
    disc: IDisc;
    fullScreen: IFullScreen;
    mode: IMode;
    playing: IPlaying;
    playlist: IPlaylist;
    searchHistory: ISearchHistory;
    sequenceList: ISequenceList;
    singer: ISinger;
    topList: ITopList;
    userName: IUserName;
};

// ******** action ********* //
export interface IAction {
    readonly type: string;
    [propName: string]: any;
};

export type IActionCreator = (param: any) => IAction;

// ******** reducer ********* //

export type IReducer = (state: IStoreState, action: IAction) => IStoreState;

// ******** defaultState ********* //
import {loadSearch} from 'common/js/cache';

export const defaultState: IStoreState = {
    currentIndex: -1,
    disc: {
        commit_time: '',
        createtime: '',
        creator: {},
        dissid: '',
        dissname: '',
        imgurl: '',
        introduction: '',
        listennum: -1,
        score: -1,
        version: -1
    },
    fullScreen: true,
    mode: playMode.sequence,
    playing: false,
    playlist: [],
    searchHistory: loadSearch(),
    sequenceList: [],
    singer: {
        id: -1,
        name: '',
        avatar: ''
    },
    topList: {
        id: -1,
        listenCount: -1,
        picUrl: '',
        songList: [],
        topTitle: '',
        type: -1
    },
    userName: ''
};
