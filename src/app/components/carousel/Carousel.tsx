import React,{ Component, useRef, useState, useCallback, useEffect } from 'react'
import './carousel.scss'
import Carouseler from './carouseler'

import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount'

interface componentsProps{
    children: any
}

const BSoptions = {
  scrollX: true,
  scrollY: false,
  momentum: false,
  snap: {
      loop: true,
      threshold: 0.3,
      speed: 400
  },
  bounce: false,
  stopPropagation: true,
  click: true
}


function Carousel(props: componentsProps){
  const [dots, setDots] = useState<Array<number>>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)

  /* ref */
  const carousel: React.RefObject<HTMLDivElement> = useRef(null)
  const carouselGroup: React.RefObject<HTMLDivElement> = useRef(null)

  /* 初始化 点 */ 
  const _initDots = useCallback(() => {
    setDots(new Array(props.children.length).fill(0))
  }, [props.children, setDots])

  /* 挂载阶段 */
  useDidMountAndWillUnmount(() => {
    if(!carousel.current && !carouselGroup.current) return 
    let carouseler = new Carouseler(
      carousel.current as HTMLElement, 
      carouselGroup.current as HTMLElement, 
      setCurrentPageIndex, 
      'carousel-item', 
      BSoptions
    )
    carouseler.init()
    _initDots()
    return carouseler.cleanUp // 注意这里return的函数会在组件卸载之前执行，这个函数会被保存在一个变量destory上，执行destory的时候，函数内部this如果没有显示绑定那么指向全局对象，严格模式下是undefined。如果被显示绑定了，比如bind那么this就是指向bind的那个对象，bind的原理就用到了闭包
  })

  return (
    <div className="carousel" ref={carousel}>
      <div className="carousel-group" ref={carouselGroup}>
        {props.children}
      </div>
      <div className="dots">
        {
          dots.length && dots.map((item, index)=><span className={"dot"+ (currentPageIndex===index?" active":"")} key={index}/>)
        }
      </div>
    </div>
  )
}

export default Carousel