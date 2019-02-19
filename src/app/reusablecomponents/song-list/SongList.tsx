import React, {Component} from 'react'
import './SongList.scss'

type itemType = {
    singer: string
    name : string
    album : string
    [index:number]:any
    [key:string]:any
}

interface SongListProps{
    songs:Array<itemType>,
    rank:boolean,
    selectItem:Function
}

interface SongListState{

}

class SongList extends Component<SongListProps, SongListState>{
    constructor(props: SongListProps){
        super(props)
    }

    getRankCls = (index:number) => {
        if (index <= 2) {
            return `icon icon${index}`
        } else {
            return 'text'
        }
    }

    getRankText = (index:number) => {
        if (index > 2) {
            return index + 1
        }
    }

    render(){
        const {songs, rank, selectItem} = this.props;
        return (
            <div className="song-list">
                <ul>
                    {
                        !!songs.length && songs.map((item, index) => (
                            <li  key={index} className="item" onClick={()=>{selectItem(item, index)}}>
                                <div className="item-rank" style={{display:rank?"":"none"}}>
                                    <span
                                        className={this.getRankCls(index)}
                                    >{this.getRankText(index)}</span>
                                </div>
                                <div className="content">
                                    <h2 className="name">{item.name}</h2>
                                    <p className="desc">{`${item.singer}·${item.album}`}</p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}

export default SongList