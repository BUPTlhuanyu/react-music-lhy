import React,{ Component } from 'react'
import './PlayList.scss'
import Scroll from 'reuse/scroll/Scroll'
import Confirm from 'reuse/confirm/Confirm'

import {
    ISequenceList
} from 'store/stateTypes'

interface PlayListProps{
    changeMode:Function,
    iconMode:Function,
    modeText:Function,
    deleteSongList:Function,
    sequenceList:ISequenceList,
    deleteSong:Function,
    getCurrentIcon:Function,
    selectItem:Function,
    scrollToCurrent:Function,
    toggleFavorite:Function
}

interface PlayListState{
    showFlag:boolean
}

class PlayList extends Component<PlayListProps,PlayListState>{
    confirm:React.RefObject<Confirm>;
    listContent:React.RefObject<Scroll>;
    scrollSon:React.RefObject<HTMLUListElement>;
    constructor(props:PlayListProps){
        super(props);
        this.confirm = React.createRef()
        this.listContent = React.createRef()
        this.scrollSon = React.createRef()
        this.state={
            showFlag:false
        }
    }

    show = () => {
        this.setState(
            {
                showFlag:true
            },()=>{
                if(!this.listContent.current || !this.scrollSon.current)return
                this.listContent.current.refresh()
                this.props.scrollToCurrent(
                    this.listContent.current,
                    this.scrollSon.current.childNodes
                )
            }
        )
    }

    hide = () => {
        this.setState(
            {
                showFlag:false
            }
        )
    }

    showConfirm = () => {
        if(!this.confirm.current)return
        this.confirm.current.show()
    }

    render(){
        const { showFlag } = this.state
        const {
            iconMode,
            changeMode,
            modeText,
            deleteSongList,
            sequenceList,
            getCurrentIcon,
            selectItem,
            deleteSong,
            toggleFavorite } = this.props
        return(
            <div className="playlist" style={{display:showFlag?"":"none"}}>
                <div className="list-wrapper">
                    <div className="list-header">
                        <h1 className="title">
                            <i className={'icon '+iconMode()}
                                onClick={()=>{changeMode()}}
                            />
                            <span className="text">{modeText()}</span>
                            <span className="clear" onClick={this.showConfirm}><i className="icon-clear"/></span>
                        </h1>
                    </div>
                    <Scroll className="list-content" ref={this.listContent}>
                        <ul ref={this.scrollSon}>
                            {
                                !!sequenceList.length && sequenceList.map((item, index)=>(
                                    <li
                                        className="item"
                                        key={index}
                                        onClick={()=>{selectItem(item,index)}}
                                    >
                                        <i className={"current "+ getCurrentIcon(item)} />
                                        <span className="text">{item.name}</span>
                                        <span className="like" onClick={()=>{toggleFavorite(item)}}>
                                            <i className="icon-not-favorite"/>
                                         </span>
                                        <span className="delete"
                                              onClick={(e)=>{
                                                  e.stopPropagation()
                                                  deleteSong(item)
                                              }}>
                                            <i className="icon-delete"/>
                                        </span>
                                    </li>
                                ))
                            }
                        </ul>
                    </Scroll>
                    <div className="list-operate">
                        <div className="add">
                        <i className="icon-add"/>
                        <span className="text">添加歌曲到队列</span>
                        </div>
                    </div>
                    <div className="list-close" onClick={this.hide}>
                        <span>关闭</span>
                    </div>
                </div>
                {/*@confirm="confirmClear"*/}
                <Confirm
                    ref={this.confirm}
                    text="是否清空播放列表"
                    confirmBtnText="清空"
                    confirmHandler={deleteSongList}
                />
                {/*<add-song ref="addSong"/>*/}
            </div>
        )
    }
}

export default PlayList