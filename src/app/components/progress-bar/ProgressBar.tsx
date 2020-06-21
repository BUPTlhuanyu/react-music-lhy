/**
 * bug:     非 hook 版本的进度条在触摸更新的时候会出现闪动的现象
 * reason:  由于非 hook 版本的进度条更新都是直接操作dom完成的，属于副作用，而 react 无法调控直接的 dom 操作，导致 react 对 dom 的更新与原生的操作有一些冲突，具体原因可以具体分析以下
 * fix:     这里使用 hook 重写了，并且抛弃直接操作 dom 的方法，都用 state 保存进度条的长度，通过 style 属性更新视图，ref 保存触摸状态。
 *          注意 usecallback 不能滥用，引用比较与大量计算可以用，并且没有依赖的 usecallback 中的 state 是初始值。
 */

import React, { Component, useRef, useState, useEffect, useCallback } from 'react'
import {prefixStyle} from 'common/js/dom'
import './ProgressBar.scss'

import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount'

interface ProgressBarPropType{
    percent:number,
    onProgressBarChange:Function
}

interface ProgressBarStateType{

}

const progressBtnWidth = 16
const transform = prefixStyle('transform')

let progressTotalWidth = 0;

interface touch{
    initiated:boolean,
    prevX:number
}

function ProgressBar(props: ProgressBarPropType) {
    const progressBar: React.RefObject<HTMLDivElement> = useRef(null);
    const touch: React.MutableRefObject<touch> = useRef({initiated: false, prevX: 0})

    const [innerWidth, setInnerWidth] = useState<number>(() => {return progressTotalWidth * props.percent})

    // 计算进度条的总长度
    useDidMountAndWillUnmount(() => {
        progressTotalWidth = progressBar.current!.clientWidth - 16;
    })

    // props 传入的百分比变化的时候需要更新进度条的视图，游标位置，显示已完成的进度条
    useEffect(() => {
        if(touch.current.initiated) return
        let newInnerWidth = progressTotalWidth * props.percent
        // 更新进度条宽度
        setInnerWidth(newInnerWidth)
    }, [props.percent])

    // 点击进度条的时候，需要更新进度条，并通知外面
    const progressClick = useCallback((e: React.MouseEvent) => {
        let newInnerWidth = e.pageX - (progressBar.current as HTMLDivElement).getBoundingClientRect().left
        // 更新进度条宽度
        setInnerWidth(newInnerWidth)
        // 通知外面
        const percent = newInnerWidth / progressTotalWidth
        props.onProgressBarChange(percent)        
    }, [progressBar, props.onProgressBarChange, setInnerWidth])

    /**
     * 以下没有必要用 useCallBack 来缓存事件处理函数，因为 div 上的 style 会频繁更新，所以事件处理函数是否是新的函数已经没有意义了
     * 相反的这里使用 useCallBack 还会带来更多的逻辑处理，画蛇添足了，同时普通函数会被垃圾回收，而传入 useCallBack 的不会，反而增加了内存
     */
    // 记录触摸点的 x 坐标，以及 percent 对应的进度条的长度
    const progressTouchStart = (e: React.TouchEvent) => {
        touch.current = {
            initiated: true,
            prevX: e.touches[0].pageX
        }
    }

    // 触摸点移动的时候实时更新进度条，并记录当前触摸点的位置
    const progressTouchMove = (e: React.TouchEvent) => {
        if(!touch.current.initiated) return;

        const deltaX = e.touches[0].pageX - touch.current.prevX
        const newInnerWidth = Math.min(progressTotalWidth - progressBtnWidth, Math.max(0, innerWidth + deltaX))

        // 更新进度条宽度
        setInnerWidth(newInnerWidth)  

        touch.current.prevX = e.touches[0].pageX
    }
    
    const progressTouchEnd= (e: React.TouchEvent)=> {
        e.preventDefault();

        if(!touch.current.initiated) return;
        
        // 通知外面
        const percent = innerWidth / progressTotalWidth
        props.onProgressBarChange(percent)  
        
        // 重置 initiated 数据
        touch.current.initiated = false
    }


    return (
        <div className="progress-bar" ref={progressBar} onClick={progressClick}>
            <div className="bar-inner">
                <div className="progress" style = {{width: `${innerWidth}px`}}></div>
                <div className="progress-btn-wrapper" style = {{transform: `translate3d(${innerWidth}px,0,0)`}}
                    onTouchStart={progressTouchStart}
                    onTouchMove={progressTouchMove}
                    onTouchEnd={progressTouchEnd}
                >
                    <div className="progress-btn"></div>
                </div>
            </div>
        </div>
    )
}

// class ProgressBar extends Component<ProgressBarPropType, ProgressBarStateType>{
//     progressBar : React.RefObject<HTMLDivElement>;
//     progress:React.RefObject<HTMLDivElement>;
//     progressBtn:React.RefObject<HTMLDivElement>;
//     touch:{
//         initiated:boolean,
//         startX:number,
//         left:number
//     };
//     constructor(props:ProgressBarPropType){
//         super(props)
//         this.progressBar = React.createRef();
//         this.progress = React.createRef();
//         this.progressBtn = React.createRef();
//         this.touch = {
//             initiated:false,
//             startX:0,
//             left:0
//         }
//     }

//     componentDidMount() {
//         Logger.red('ProgressBar')
//     }

//     componentDidUpdate(){
//         this.percent(this.props.percent)
//     }

//     progressClick = (e:any) => {
//         if(!this.progressBar.current)return
//         const rect = this.progressBar.current.getBoundingClientRect()
//         const offsetWidth = e.pageX - rect.left
//         this._offset(offsetWidth)
//         // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
//         // this._offset(e.offsetX)
//         this._triggerPercent()
//     }

//     progressTouchStart = (e:any)=> {
//         if(!this.progress.current)return
//         e.preventDefault();
//         this.touch.initiated = true
//         this.touch.startX = e.touches[0].pageX
//         this.touch.left = this.progress.current.clientWidth
//     }

//     progressTouchMove= (e:any)=> {
//         if(!this.progressBar.current)return
//         e.preventDefault();
//         if (!this.touch.initiated) {
//             return
//         }
//         const deltaX = e.touches[0].pageX - this.touch.startX
//         const offsetWidth = Math.min(this.progressBar.current.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
//         this._offset(offsetWidth)
//     }

//     progressTouchEnd= (e:any)=> {
//         e.preventDefault();
//         this.touch.initiated = false
//         this._triggerPercent()
//     }

//     _triggerPercent= ()=> {
//         if(!this.progressBar.current || !this.progress.current)return
//         const barWidth = this.progressBar.current.clientWidth - progressBtnWidth
//         const percent = this.progress.current.clientWidth / barWidth
//         this.props.onProgressBarChange(percent)
//     }

//     _offset= (offsetWidth:number)=> {
//         if(!this.progressBtn.current || !this.progress.current)return
//         this.progress.current.style.width = `${offsetWidth}px`
//         this.progressBtn.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`
//     }

//     percent = (percent: number) => {
//         if(!this.progressBar.current )return
//         if (percent >= 0 && !this.touch.initiated) {
//             const barWidth = this.progressBar.current.clientWidth - progressBtnWidth
//             const offsetWidth = percent * barWidth
//             this._offset(offsetWidth)
//         }
//     }

//     render(){
//         return (
//             <div className="progress-bar" ref={this.progressBar} onClick={this.progressClick}>
//                 <div className="bar-inner">
//                     <div className="progress" ref={this.progress}></div>
//                     <div className="progress-btn-wrapper" ref={this.progressBtn}
//                         onTouchStart={this.progressTouchStart}
//                          onTouchMove={this.progressTouchMove}
//                          onTouchEnd={this.progressTouchEnd}
//                     >
//                         <div className="progress-btn"></div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

export default ProgressBar