import React,{ Component } from 'react'
import SearchBox from 'reuse/search-box/SearchBox'
import './Search.scss'
import {getHotKey, search} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/Suggest'
import {createSongSearch} from 'common/js/song'
import { Route, withRouter } from 'react-router'
import SingerDetail from '../singer-detail/SingerDetail'
import { connect } from 'react-redux'
import { setSearchHistory } from 'actions/search'
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache'
import SearchList from 'reuse/search-list/SearchList'
import Confirm from 'reuse/confirm/Confirm'

const TYPE_SINGER = 'singer'
const perpage = 20

interface SearchPropType{
    setSearchHistory:Function,
    searchHistory:Array<any>
}

interface SearchStateType{
    hotKey:Array<any>,
    query:string,
    page:number,
    result:Array<any>,
    hasMore:boolean
}

class Search extends Component<SearchPropType, SearchStateType>{
    searchBox:any;
    unmoutedFlag:boolean;
    confirm:any;
    constructor(props:SearchPropType){
        super(props)
        this.unmoutedFlag = false
        this.searchBox = React.createRef()
        this.confirm = React.createRef()
        this.state = {
            hotKey:[],
            query:'',
            page:1,
            result:[],
            hasMore:false
        }
    }

    componentDidMount(){
        this._getHotKey()
    }

    onQueryChange = (query:string) => {
        this.setState({
            query
        })
        this.search(query)
    }

    _getHotKey = () => {
        getHotKey().then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    hotKey: res.data.hotkey.slice(0, 10)
                })
            }
        })
    }

    addQuery = (query:string) => {
        console.log("this",this)
        this.searchBox.current.setQuery(query)
        this.setState({
            query
        })
        this.search(query)
    }

    //完全受控组件，子组件需要依赖父组件的props并且执行异步请求最后更新state的情况下
    //业务逻辑简单的可以通过static getDerivedStateFromProps()静态方法来实现
    search = (query:string) => {
        this.setState({
            page:1,
            hasMore:true
        })
        search(query, this.state.page, true, perpage).then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    result : this._genResult(res.data),
                    hasMore : this._checkMore(res.data)
                })
            }
        })
    }

    _checkMore = (data:any) => {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
            return false
        }
        return true
    }

    _genResult = (data:any) => {
        let ret = []
        if (data.zhida && data.zhida.zhida_singer && data.zhida.zhida_singer.singerID) {
            ret.push({...data.zhida.zhida_singer, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
            ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
    }

    _normalizeSongs(list:any) {
        let ret:Array<any> = []
        list.forEach((musicData:any) => {
            if (musicData.id && musicData.album.mid) {
                ret.push(createSongSearch(musicData))
            }
        })
        return ret
    }

    searchMore = () => {
        if (!this.state.hasMore) {
            return
        }
        this.setState((state) => ({
            page : state.page + 1
        }))
        search(this.state.query, this.state.page, true , perpage).then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    result : this.state.result.concat(this._genResult(res.data)),
                    hasMore : this._checkMore(res.data)
                })
            }
        })
    }

    saveSearch = () => {
        this.props.setSearchHistory(saveSearch(this.state.query))
    }

    deleteSearch = (query:string) => {
        this.props.setSearchHistory(deleteSearch(query))
    }

    clearSearchHistory = () => {
        this.props.setSearchHistory(clearSearch())
    }

    showConfirm = () => {
        this.confirm.current.show()
    }

    render(){
        const { hotKey, query, result, hasMore, page } = this.state
        const { searchHistory } = this.props
        return(
            <div className="search">
                <div className="search-box-wrapper">
                    <SearchBox ref={this.searchBox} queryHandler={this.onQueryChange}/>
                </div>
                <div className="shortcut-wrapper" style={{display:!query?"":"none"}}>
                    <div className="shortcut">
                        <div>
                            <div className="hot-key">
                                <h1 className="title">热门搜索</h1>
                                <ul>
                                    {
                                        !!hotKey.length && hotKey.map((item, index) => (
                                            <li key={index}
                                                className="item"
                                                onClick={()=>{this.addQuery(item.k)}}
                                            >
                                                <span>{item.k}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div className="search-history">
                                <h1 className="title">
                                    <span className="text">搜索历史</span>
                                    <span className="clear" onClick={this.showConfirm}>
                                        <i className="icon-clear"/>
                                    </span>
                                </h1>
                                <SearchList
                                    searches={searchHistory}
                                    selectItem={this.addQuery}
                                    deleteItem={this.deleteSearch}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-result" style={{display:query?"":"none"}}>
                    <Suggest result={result}
                             hasMore={hasMore}
                             suggestHandler={this.searchMore}
                             page={page}
                             saveSearch={this.saveSearch}
                    />
                </div>
                <Confirm    ref={this.confirm}
                            text="是否清空所有搜索历史"
                            confirmBtnText="清空"
                            confirmHandler = {this.clearSearchHistory}
                />
                <Route path="/search/:id" component={SingerDetail}/>
            </div>
        )
    }
}

const mapStateToProps = (state:any) => ({
    searchHistory:state.searchHistory
})

const mapDispatchToProps = (dispatch:any) => {
    return {
        setSearchHistory : (searchHistory:string) => {
            dispatch(setSearchHistory(searchHistory))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Search)