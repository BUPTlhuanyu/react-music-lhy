import React, {Component, useRef, useState, RefObject} from 'react'
import BScroll, { BsOption, Position } from 'better-scroll'
import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount'

function initScroller(ref: RefObject<Element>, options: Partial<BsOption>): BScroll{
    const {
        probeType = 2,
        click
    } = options
    let wrapperBs = new BScroll(ref.current!, {
        probeType,
        click
    })
    return wrapperBs
}

function useScroll(ref: RefObject<Element>, options: Partial<BsOption>): any{
    
    const wrapperBs: React.MutableRefObject<BScroll | null> = useRef(null)    // 用于存储 scroll 实例， ref 在每一轮生命周期中都能实时访问到更新的数据， useState 则不同

    // const [scrollPos, setScrollPos] = useState<Position>()                    // 存储实时滚动的位置，这里可能会存在问题
    // const [scrollEndPos, setScrollEndPos] = useState<Position>()

    // const [pullUp, setPullUp] = useState<boolean>()
    useDidMountAndWillUnmount(() => {
        // 这里不需要判断 ref 是否能够拿到 dom，因为这里模拟的 didMount 执行之前，会更新所有节点的 ref，因此都是能拿到 dom 的
        if(!wrapperBs.current){
            wrapperBs.current = initScroller(ref, options) 
            return function(){
                wrapperBs.current && wrapperBs.current.destroy()
                wrapperBs.current = null
            }
        }
        // wrapperBs.current.on('scroll', (pos: Position) => {
        //     setScrollPos( pos )
        // })
        // wrapperBs.current.on('scrollEnd', (pos: Position) => {
        //     setScrollEndPos( pos )
        // })
        // wrapperBs.on('scrollEnd', () => {
        //     if (wrapperBs.y <= (wrapperBs.maxScrollY + 50)) {
        //         setPullUp
        //     }
        // })
    })

    return {
        // scrollPos,
        // scrollEndPos,
        wrapperBs
    }
}

export default useScroll