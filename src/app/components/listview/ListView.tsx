/**
 * @Description:  组件数据类型： Array<dataType>
 * @author: liaohuanyu
 * @date 2019/2/19
*/

import React,{ Component, TouchEvent, useRef, useState, useEffect } from 'react'
import Loading from 'src/app/components/loading/Loading'
import './ListView.scss'
import LazyImage from 'src/app/components/lazyimg/Lazy-img'
import Scroll from 'src/app/components/scroll/Scroll'
import {getData} from 'common/js/dom.js'
import classnames from 'classnames';

import useDidMountAndWillUnmount from 'src/app/hooks/useDidMountAndWillUnmount'
import useScroll from 'hooks/useScroll'

//边条每个li的高度
const ANCHOR_HEIGHT = 18;
//title高度
const TITLE_HEIGHT = 30;

type IItem = {
    id : number
    name : string
    avatar : string
    [index:number]:any
    [key:string]:any
}

interface dataType {
    title:string,
    items:Array<IItem>
    [index:number]:any
    [key:string]:any
}

interface ListViewProps{
    data : Array<dataType>,
    getItem: Function,
    listClassName?: string | Object
}

interface touchType{
    prevY : number;
    anchorIndex : string;
}

interface ListViewState{
    currentIndex : number,
    listHeight:Array<any>
    root: Element | null
}

let listHeight: number[] = []
let touch = {
    prevY : 0,
    anchorIndex: ""
}
const ListView = function(props: ListViewProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [shortcutList, setShortcutList] = useState<Array<string>>(() => {
        return props.data.map((group) => {
            return group.title.substr(0, 1)
        })
    })
    const listviewClassName = classnames(
        'listview',
        props.listClassName
    );

    const listGroup: React.RefObject<HTMLUListElement> = useRef(null)
    const scrollContanier: React.MutableRefObject<HTMLDivElement | null> = useRef(null)   // scrollContanier ref
    const fixed: React.RefObject<HTMLDivElement> = useRef(null)

    const scrollHandler = (pos : {x:number,y:number}) => {
        Logger.green('scrollHandler', pos.y)
        // console.log("this",this)
        if(Object.is(pos.y,NaN)){
            return
        }
        let newY = pos.y;
            // 当滚动到顶部，newY>0
            if (newY > 0) {
                setCurrentIndex(0)
                return
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (-newY >= height1 && -newY < height2) {
                    setCurrentIndex(i)
                    let diff = height2 + newY;
                    let fixedTop = (diff > 0 && diff < TITLE_HEIGHT) ? diff - TITLE_HEIGHT : 0
                    fixed.current && (fixed.current.style.transform = `translate3d(0,${fixedTop}px,0)`)
                    return
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
            Logger.green('滚动到底部')
            setCurrentIndex(listHeight.length - 2)
    }
    const wrapperBs = useScroll(scrollContanier, { click: true, probeType: 3,  scrollHandler: scrollHandler})
    

    useDidMountAndWillUnmount(() => {
        let timer = setTimeout(()=>{
            // 计算每个字母下卡片的高度和
            if(!listGroup.current){
                return
            }
            const list = listGroup.current.children
            let height = 0
            listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                let item = list[i]
                height += item.clientHeight
                listHeight.push(height)
            }            
        },100)

        return function() {
            clearTimeout(timer)
        }
    })

    // 更新歌手数据
    useEffect(() => {
        setShortcutList(
            props.data.map((group) => {
                return group.title.substr(0, 1)
            })
        )
    }, [props.data])

    const onTouchStartHandler = function(e: React.TouchEvent) {
        e.preventDefault();
        if(!listGroup.current)return
        let anchorIndex = Number(getData(e.target, 'index'))
        if(anchorIndex){
            let firstTouch = e.touches[0]
            touch = Object.assign({}, touch,{
                prevY: firstTouch.pageY,
                anchorIndex
            })
            setCurrentIndex(anchorIndex)
            setTimeout(() => {
                if(wrapperBs.current && listGroup.current) {
                    wrapperBs.current.scrollToElement((listGroup.current.childNodes[anchorIndex] as HTMLElement), 0)  
                }
            }, 50)
        }else{
            return
        }
    }

    const onTouchMoveHandler = function(e: React.TouchEvent) {
        Logger.green('onTouchMoveHandler')
        e.preventDefault();
        let firstTouch = e.touches[0]
        let curY = firstTouch.pageY
        if(!listGroup.current)return
        let delta = (curY - touch.prevY) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(touch.anchorIndex) + delta
        if(anchorIndex<0){
            anchorIndex = 0;
        }else if(anchorIndex > listGroup.current.childNodes.length-1){
            anchorIndex = listGroup.current.childNodes.length-1;
        }else if(Object.is(anchorIndex, NaN)){
            return
        }
        setCurrentIndex(anchorIndex)
        setTimeout(() => {
            if(wrapperBs.current && listGroup.current) {
                wrapperBs.current.scrollToElement((listGroup.current.childNodes[anchorIndex] as HTMLElement), 0)  
            }
        }, 50)
    }

    return (
        <div className={listviewClassName} ref = {scrollContanier}>
            <ul ref = {listGroup}>
                {
                    !! props.data.length && props.data.map((group:{title:string,items:Array<any>})=>(
                        <li className="list-group" key={group.title} >
                            <h2 className="list-group-title">{group.title}</h2>
                            <ul>
                                {
                                    !! group.items.length && group.items.map((item: IItem)=>(
                                        <li className="list-group-item" key={item.id} onClick={props.getItem.bind(null, item)}>
                                            <LazyImage
                                                selector = ".avatarListLazy"
                                                className="avatarListLazy avatar"
                                                root={scrollContanier.current}
                                                sizes="200px"
                                                srcset={item.avatar}
                                                width="60"
                                                height="60"
                                                />
                                            <span className="name">{item.name}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))
                }
            </ul>
            <div className="list-shortcut" onTouchStart={onTouchStartHandler} onTouchMove={onTouchMoveHandler}>
                <ul>
                    {
                        !!shortcutList.length && shortcutList.map((item, index)=>{
                            let className = "item" + (currentIndex === index? " current" : "");
                            return <li className={className} key={index} data-index={index}>{item}</li>
                        })
                    }
                </ul>
            </div>
            <div className="list-fixed" ref={fixed}>
                <div className="fixed-title"> {props.data[currentIndex] ? props.data[currentIndex].title : ''}</div>
            </div>
            {
                !props.data.length &&
                <div className="loading-container">
                    <Loading />
                </div>
            }
        </div>        
    )
}

export default ListView

