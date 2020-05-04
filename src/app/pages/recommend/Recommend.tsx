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
import useDidMountAndWillUnmount from 'src/app/hooks/useDidMountAndWillUnmount'

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
  maxage: number,
  prevTime: number,
  recommends: Array<recommendItem>,
  discList: Array<IDisc>
} = {
  maxage: 300000,
  prevTime: 0,
  recommends: [],
  discList: []
};
function updateCacheData(
  data: 
  {    
    recommends?: Array<recommendItem>,
    discList?: Array<IDisc>
  }
){
  Object.assign(cacheData, data)
}


function getRecommendData(setState: React.Dispatch<React.SetStateAction<recommendItem[]>>, unmoutedFlag: boolean) {
  getRecommend().then((res) => {
    if (res.code === ERR_OK && !unmoutedFlag) {
      console.log('res.data.slider', res.data.slider)
      setState(res.data.slider)
      updateCacheData({recommends: res.data.slider})
    }
  })
}
function getDiscListData(setState: React.Dispatch<React.SetStateAction<IDisc[]>>, unmoutedFlag: boolean) {
  getDiscList().then((res) => {
    if (res.code === ERR_OK && !unmoutedFlag) {
      setState(res.data.list)
      updateCacheData({discList: res.data.list})
    }
  })
}

/**
 * 选择歌单之后进行前端路由跳转
 * @param disc 
 * @param props 
 */
function selectDisc(disc: IDisc, props: Props) {
  props.history.push(`/recommend/${disc.dissid}`);
  props.setDisc(disc)
}

function Recommend(props: Props){
  const [recommends, setRecommends] = useState<Array<recommendItem>>([])  // 轮播图数据
  const [discList, setDiscList] = useState<Array<IDisc>>([])              // 歌单列表数据

  const unmoutedFlag = useRef(false)                                      // 组件是否挂载

  useDidMountAndWillUnmount(() => {
      /* 如果手动刷新或者时间超过了5分钟组件挂载了，那么就需要重新获取推荐列表以及歌单列表 */
      if(Date.now() - cacheData.prevTime > cacheData.maxage){
          cacheData.prevTime = Date.now()                                 // 设置缓存的时间为当前向后端获取数据的时间
          getRecommendData(setRecommends, unmoutedFlag.current)           // 获取轮播图推荐歌单
          getDiscListData(setDiscList, unmoutedFlag.current)              // 获取歌单列表
          
      }else{
          setRecommends(cacheData.recommends)
          setDiscList(cacheData.discList)
      }
      /* 卸载的时候标记为挂载，以免组件卸载之后数据请求返回导致渲染报错 */
      return function willunmount(){
          unmoutedFlag.current = true
      }
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
                      <div key={item.id}>
                        <a href={item.linkUrl}><img src={item.picUrl}/></a>
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
                  <li className="item" key={item.dissid} onClick={() => {selectDisc(item, props)}}>
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

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {
    setDisc : (disc:IDisc) => {
      dispatch(setDisc(disc))
    }
  }
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(Recommend))