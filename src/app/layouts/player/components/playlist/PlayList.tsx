import React, {Component} from 'react';
import './PlayList.scss';
import Scroll from 'src/app/components/scroll/Scroll';
import Confirm from 'src/app/components/confirm/Confirm';

import {ISequenceList, ISong} from 'store/stateTypes';

interface PlayListProps {
    changeMode: () => void;
    iconMode: () => void;
    modeText: () => string;
    deleteSongList: () => void;
    sequenceList: ISequenceList;
    deleteSong: (song: ISong) => void;
    getCurrentIcon: (song: ISong) => void;
    selectItem: (song: ISong, index: number) => void;
    scrollToCurrent: (scroll: Scroll, childs: NodeListOf<ChildNode>) => void;
    toggleFavorite: (song: ISong) => void;
}

interface PlayListState {
    showFlag: boolean;
    openConfirm: boolean;
}

class PlayList extends Component<PlayListProps, PlayListState> {
    confirm: React.RefObject<any>;
    listContent: React.RefObject<Scroll>;
    scrollSon: React.RefObject<HTMLUListElement>;
    constructor(props: PlayListProps) {
        super(props);
        this.confirm = React.createRef();
        this.listContent = React.createRef();
        this.scrollSon = React.createRef();
        this._deleteSongList = this._deleteSongList.bind(this);
        this.state = {
            showFlag: false,
            openConfirm: false
        };
    }

    show = () => {
        this.setState(
            {
                showFlag: true
            },
            () => {
                if (!this.listContent.current || !this.scrollSon.current) {
                    return;
                }
                this.listContent.current.refresh();
                this.props.scrollToCurrent(this.listContent.current, this.scrollSon.current.childNodes);
            }
        );
    };

    hide = () => {
        this.setState({
            showFlag: false
        });
    };

    showConfirm = () => {
        this.setState({
            openConfirm: true
        });
    };

    // 需要在内部构建一些 ts 类型，也方便以后抽出为公共组件库
    _deleteSongList = (closeTag: string) => {
        this.setState({
            openConfirm: false
        });
        if (closeTag === 'confirm') {
            this.props.deleteSongList();
        }
    };

    render() {
        const {showFlag} = this.state;
        const {
            iconMode,
            changeMode,
            modeText,
            sequenceList,
            getCurrentIcon,
            selectItem,
            deleteSong,
            toggleFavorite
        } = this.props;
        return (
            <div className="playlist" style={{display: showFlag ? '' : 'none'}}>
                <div className="list-wrapper">
                    <div className="list-header">
                        <h1 className="title">
                            <i
                                className={'icon ' + iconMode()}
                                onClick={() => {
                                    changeMode();
                                }}
                            />
                            <span className="text">{modeText()}</span>
                            <span className="clear" onClick={this.showConfirm}>
                                <i className="icon-clear" />
                            </span>
                        </h1>
                    </div>
                    <Scroll className="list-content" ref={this.listContent}>
                        <ul ref={this.scrollSon}>
                            {!!sequenceList.length
                                && sequenceList.map((item, index) => (
                                    <li
                                        className="item"
                                        key={index}
                                        onClick={() => {
                                            selectItem(item, index);
                                        }}
                                    >
                                        <i className={'current ' + getCurrentIcon(item)} />
                                        <span className="text">{item.name}</span>
                                        <span
                                            className="like"
                                            onClick={() => {
                                                toggleFavorite(item);
                                            }}
                                        >
                                            <i className="icon-not-favorite" />
                                        </span>
                                        <span
                                            className="delete"
                                            onClick={e => {
                                                e.stopPropagation();
                                                deleteSong(item);
                                            }}
                                        >
                                            <i className="icon-delete" />
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </Scroll>
                    <div className="list-operate">
                        <div className="add">
                            <i className="icon-add" />
                            <span className="text">添加歌曲到队列</span>
                        </div>
                    </div>
                    <div className="list-close" onClick={this.hide}>
                        <span>关闭</span>
                    </div>
                </div>
                {/* @confirm="confirmClear" */}
                <Confirm
                    open={this.state.openConfirm}
                    text="是否清空播放列表"
                    confirmBtnText="清空"
                    onClose={this._deleteSongList}
                />
                {/* <add-song ref="addSong"/> */}
            </div>
        );
    }
}

export default PlayList;
