import './recommend.scss'
import React,{ Component, useState, useRef } from 'react'
import { connect } from 'react-redux'
import {  Route, withRouter } from 'react-router'
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config'

import Carousel from 'components/carousel/Carousel'
import LazyImage from 'components/lazyimg/Lazy-img'
import Loading from 'components/loading/Loading'
import Disc from 'pages/recommend/components/disc/Disc'

import useDidMountAndWillUnmount from 'src/app/hooks/useDidMountAndWillUnmount'
import useScroll from 'hooks/useScroll'

import { setDisc } from 'actions/disc'
import { Props, recommendItem, Disc as IDisc }  from './types'
import { Dispatch } from 'redux';
import BScroll from 'better-scroll'

import {
  IStoreState
} from 'store/stateTypes'

/**
 * 更新内存缓存的数据
 */
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

/**
 * 获取推荐数据，并将数据传入setState
 * @param setState 用于更新组件state
 * @param unmoutedFlag 这里需要传入ref对象，引用传递才能使得外界修改该对象属性值影响到函数内部的逻辑
 */
function getRecommendData(setState: React.Dispatch<React.SetStateAction<recommendItem[]>>, unmoutedFlag: React.MutableRefObject<boolean>) {
  getRecommend().then((res) => {
    if (res.code === ERR_OK && !unmoutedFlag.current) {
      setState(res.data.slider)
      updateCacheData({recommends: res.data.slider})
    }
  })
}
function getDiscListData(setState: React.Dispatch<React.SetStateAction<IDisc[]>>, unmoutedFlag: React.MutableRefObject<boolean>) {
  getDiscList().then((res) => {
    if (res.code === ERR_OK && !unmoutedFlag.current) {
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
  const [recommends, setRecommends] = useState<Array<recommendItem>>([])                // 轮播图数据
  const [discList, setDiscList] = useState<Array<IDisc>>([])                            // 歌单列表数据
  const [root, setContainer] = useState<Element | null>(null)

  const unmoutedFlag: React.MutableRefObject<boolean> = useRef(false)                   // 组件是否挂载
  const scrollContanier: React.MutableRefObject<HTMLDivElement | null> = useRef(null)   // scrollContanier ref
  const scroller: any = useScroll(scrollContanier, { click: true })                       // ！！！这里的类型需要确定一下

  useDidMountAndWillUnmount(() => {
      console.log('%cRecommend', 'color: red' );
      /* 获取图片懒加载的root节点 */
      let root = document.querySelector(".recommend")
      setContainer(root)
      /* 如果手动刷新或者时间超过了5分钟组件挂载了，那么就需要重新获取推荐列表以及歌单列表 */
      if(Date.now() - cacheData.prevTime > cacheData.maxage){
          cacheData.prevTime = Date.now()                                               // 设置缓存的时间为当前向后端获取数据的时间
          getRecommendData(setRecommends, unmoutedFlag)                                 // 获取轮播图推荐歌单
          getDiscListData(setDiscList, unmoutedFlag)                                    // 获取歌单列表
      }else{
          setRecommends(cacheData.recommends)
          setDiscList(cacheData.discList)
      }
      /* 卸载的时候标记为挂载，以免组件卸载之后数据请求返回导致渲染报错 */
      return function willunmount(){
          unmoutedFlag.current = true
          scrollContanier.current = null
          scroller.wrapperBs.current = null
      }
  })
  return(
    <div className="recommend">
      <div className="recommend-content" ref = {scrollContanier}>
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
          <div className="recommend-list" style= {{ paddingBottom: `${props.fullScreen? '0' : '60px'}` }}>
            <h1 className="list-title">热门歌单推荐{scroller.x}</h1>
            <ul>
              {
                !!discList.length && discList.map((item, index)=>(
                  <li className="item" key={item.dissid} onClick={() => {selectDisc(item, props)}}>
                    <div className="icon">
                      <LazyImage
                        selector = ".discListLazy"
                        className="discListLazy"
                        root = {root}
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
          !discList.length && <Loading customCls="loading-container" />
        }
      </div>
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

const mapStateToProp = (state: IStoreState) => ({
  fullScreen : state.fullScreen
})

export default withRouter(connect(mapStateToProp, mapDispatchToProps)(Recommend))