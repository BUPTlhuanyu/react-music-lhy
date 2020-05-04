import './recommend.scss'
import React,{ Component, useState, useRef } from 'react'
import { connect } from 'react-redux'
import {  Route, withRouter } from 'react-router'
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config'
import Carousel from 'components/carousel/Carousel'
import Scroll from 'components/scroll/Scroll'
import Loading from 'components/loading/Loading'
import LazyImage from 'components/lazyimg/Lazy-img'
import Disc from 'pages/recommend/components/disc/Disc'
import useDidMount from 'hooks/useDidMount'

import { setDisc } from 'actions/disc'
import { IDisc } from 'store/stateTypes'
import { Dispatch } from 'redux';

interface Props{
    setDisc:Function,
    history:any,
    location:any,
    match:any
}

interface recommendItem{
    linkUrl: string
    picUrl: string
    [key: string]: any
}

interface State{
    recommends: Array<recommendItem>,
    discList:Array<IDisc>
}

let cacheData:{
    recommends: Array<any>,
    discList:Array<IDisc>
};

function getRecommendData(setState: React.Dispatch<React.SetStateAction<recommendItem[]>>, unmoutedFlag: boolean) {
    getRecommend().then((res) => {
        if (res.code === ERR_OK && !unmoutedFlag) {
            setState(res.data.slider)
        }
    })
}
function getDiscListData(setState: React.Dispatch<React.SetStateAction<IDisc[]>>, unmoutedFlag: boolean) {
    getDiscList().then((res) => {
        if (res.code === ERR_OK && !unmoutedFlag) {
            setState(res.data.list)
        }
    })
}

function selectDisc(disc: IDisc, props: Props) {
    props.history.push(`/recommend/${disc.dissid}`);
    props.setDisc(disc)
}

function Recommend(props: Props){
    const [recommends, setRecommends] = useState<Array<recommendItem>>([])
    const [discList, setDiscList] = useState<Array<IDisc>>([])

    // 组件是否挂载
    const unmoutedFlag = useRef(false)

    useDidMount(() => {
        console.log('Recommend render')
        // 获取轮播图推荐歌单
        getRecommendData(setRecommends, unmoutedFlag.current)
        // 获取歌单列表
        getDiscListData(setDiscList, unmoutedFlag.current)
    })
    return(
        <div className="recommend">
                <Scroll className="recommend-content">
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
                                        <li className="item" key={index} onClick={() => {selectDisc(item, props)}}>
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

// class Recommend extends Component<Props,State>{
//     unmoutedFlag:boolean;
//     constructor(props:Props){
//         super(props);
//         this.unmoutedFlag=false
//         this.state = {
//             recommends: [],
//             discList:[]
//         }
//     }
//     componentDidMount(){
//         // console.log("Recommend的componentDidMount")
//         if(cacheData){
//             console.log("cacheData")
//             this.setState(
//                 {
//                     recommends: cacheData.recommends,
//                     discList:cacheData.discList
//                 }
//             )
//         }else{
//             this.getRecommend()
//             this.getDiscList()
//         }
//     }

//     componentWillUnmount(){
//         cacheData = {
//             recommends:this.state.recommends,
//             discList:this.state.discList
//         }
//         this.unmoutedFlag=true
//     }
// }

const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        setDisc : (disc:IDisc) => {
            dispatch(setDisc(disc))
        }
    }
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(Recommend))