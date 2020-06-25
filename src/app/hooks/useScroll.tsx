import React, {Component, useRef, useState, RefObject} from 'react'
import BScroll, { BsOption, Position } from 'better-scroll'
import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount'

function initScroller(ref: RefObject<Element>, options: Partial<BsOption> & any): BScroll{
    const {
        scrollHandler,
        probeType = 2,
        click,
        ...rest
    } = options
    let wrapperBs = new BScroll(ref.current!, {
        probeType,
        click,
        ...rest
    })
    scrollHandler && wrapperBs.on('scroll', (pos:Object) => {
         scrollHandler(pos)
    })
    return wrapperBs
}

function useScroll(ref: RefObject<Element>, options: Partial<BsOption> & any): React.MutableRefObject<BScroll | null>{
    const wrapperBs: React.MutableRefObject<BScroll | null> = useRef(null)    // 用于存储 scroll 实例， ref 在每一轮生命周期中都能实时访问到更新的数据， useState 则不同
    useDidMountAndWillUnmount(() => {
        // 这里不需要判断 ref 是否能够拿到 dom，因为这里模拟的 didMount 执行之前，会更新所有节点的 ref，因此都是能拿到 dom 的
        if(!wrapperBs.current){
            wrapperBs.current = initScroller(ref, options) 
            return function(){
                wrapperBs.current && wrapperBs.current.destroy()
                wrapperBs.current = null
            }
        }
    })

    return wrapperBs
}

export default useScroll