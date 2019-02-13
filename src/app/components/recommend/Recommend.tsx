import './recommend.scss'
import React,{ Component } from 'react'
import { connect } from 'react-redux'
import {  Route, withRouter } from 'react-router'
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config'
import Carousel from 'reuse/carousel/Carousel'
import Scroll from 'reuse/scroll/Scroll'
import Loading from 'reuse/loading/Loading'
import LazyImage from 'reuse/lazyimg/Lazy-img'
import Disc from 'components/disc/Disc'
import { setDisc } from 'actions/disc'


interface Props{
    setDisc:Function,
    history:any,
    location:any,
    match:any
}

interface State{
    recommends: Array<any>,
    discList:Array<any>
}

let cacheData:{
    recommends: Array<any>,
    discList:Array<any>
};

class Recommend extends Component<Props,State>{
    unmoutedFlag:boolean;
    recommend:any;
    constructor(props:Props){
        super(props);
        this.recommend = React.createRef()
        this.unmoutedFlag=false
        this.state = {
            recommends: [],
            discList:[]
        }
    }
    componentDidMount(){
        // console.log("Recommend的componentDidMount")
        if(cacheData){
            this.setState(
                {
                    recommends: cacheData.recommends,
                    discList:cacheData.discList
                }
            )
        }else{
            this._getRecommend()
            this._getDiscList()
        }
    }

    componentWillUnmount(){
        cacheData = {
            recommends:this.state.recommends,
            discList:this.state.discList
        }
        this.unmoutedFlag=true
    }

    _getRecommend() {
        getRecommend().then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    recommends: res.data.slider
                })
            }
        })
    }

    async _getDiscList(){
        const data = await getDiscList();
        // console.log(data)
        //这里应该用ts的类型判断来代替
        if(data && !this.unmoutedFlag){
            this.setState({
                discList: data.list
            })
        }
    }

    selectDisc = (disc:any) => {
        this.props.history.push(`/recommend/${disc.dissid}`);
        this.props.setDisc(disc)
    }

    render(){
        // console.log("Recommend的render")
        const {recommends, discList} = this.state;
        return(
            <div className="recommend">
                    <Scroll className="recommend-content" ref={this.recommend}>
                        <div>
                            <div className="slider-wrapper">
                                {
                                    !!recommends.length &&
                                    <Carousel>
                                        {
                                            recommends.map((item, index)=>(
                                                    <div key={index}>
                                                        <a href={item.linkUrl}>
                                                            <img src={item.picUrl}/>
                                                        </a>
                                                    </div>
                                                )
                                            )
                                        }
                                    </Carousel>
                                }
                            </div>
                            <div className="recommend-list">
                                <h1 className="list-title">热门歌单推荐</h1>
                                <ul>
                                    {
                                        !!discList.length && discList.map((item, index)=>(
                                            <li className="item" key={index} onClick={() => {this.selectDisc(item)}}>
                                                <div className="icon">
                                                    <LazyImage
                                                        className="discListLazy"
                                                        containerClassName="recommend"
                                                        sizes="200px"
                                                        src="https://placehold.it/200x300?text=Image1"
                                                        srcset={item.imgurl}
                                                        width="60"
                                                        height="60"
                                                    />
                                                </div>
                                                <div className="text">
                                                    <h2 className="name">{item.creator.name}</h2>
                                                    <p className="desc">{item.dissname}</p>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        {
                            !discList.length &&
                            <div className="loading-container" >
                                <Loading/>
                            </div>
                        }
                    </Scroll>
                    <Route path="/recommend/:id" component={Disc}/>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        setDisc : (disc:any) => {
            dispatch(setDisc(disc))
        }
    }
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(Recommend))