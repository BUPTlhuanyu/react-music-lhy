import React,{ Component } from 'react'
import './Rank.scss'
import Loading from 'reuse/loading/Loading'
import Scroll from 'reuse/scroll/Scroll'
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import { Route, withRouter } from 'react-router'
import TopList from 'components/top-list/TopList'
import LazyImage from 'reuse/lazyimg/Lazy-img'
import { connect } from 'react-redux'
import { setTopList } from 'actions/rank'


import {
    IStoreState,
    ITopList
} from 'store/stateTypes'
import { Dispatch } from 'redux'

interface RankStateType{
    topListArr:Array<ITopList>
}

interface RankPropType{
    history:any,
    location:any,
    match:any,
    setTopList:Function
}

class Rank extends Component<RankPropType,RankStateType>{
    unmoutedFlag:boolean;
    toplist:any;
    constructor(props:RankPropType){
        super(props)
        this.unmoutedFlag=false
        this.toplist = React.createRef()
        this.state = {
            topListArr:[]
        }
    }

    componentDidMount(){
        this._getTopList()
    }

    selectItem = (item:any) => {
        this.props.history.push(`/rank/${item.id}`)
        this.props.setTopList(item)
    }

    _getTopList = () => {
        getTopList().then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    topListArr:res.data.topList
                })
            }
        })
    }

    render(){
        const { topListArr } = this.state
        return(
            <div className="rank" ref="rank">
                <Scroll className="toplist" ref={this.toplist}>
                    <ul>
                        {
                            !!topListArr.length && topListArr.map((item:any, index:number) =>(
                                <li className="item" key={index} onClick={() => {this.selectItem(item)}}>
                                    <div className="icon">
                                        <LazyImage
                                            className="RankListLazy"
                                            containerClassName="rank"
                                            sizes="200px"
                                            src="https://placehold.it/200x300?text=Image1"
                                            srcset={item.picUrl}
                                            width="100"
                                            height="100"
                                        />
                                    </div>
                                    <ul className="songlist">
                                        {
                                            item.songList && item.songList.map((song:any, index:number) => (
                                                <li className="song" key={index}>
                                                    <span>{index + 1}</span>
                                                    <span>{song.songname}-{song.singername}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                    {
                        !topListArr.length &&
                        <div className="loading-container">
                            <Loading/>
                        </div>
                    }
                </Scroll>
                <Route path="/rank/:id" component={TopList}/>
            </div>
        )
    }
}

const mapStateToProps = (state:IStoreState,ownProps:any) => ({
    ...ownProps
})

const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        setTopList : (topList:ITopList) => {
            dispatch(setTopList(topList))
        }
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Rank))