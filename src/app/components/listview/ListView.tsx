/**
 * @Description:  组件数据类型： Array<dataType>
 * @author: liaohuanyu
 * @date 2019/2/19
*/

import React,{ Component, TouchEvent } from 'react'
import Loading from 'src/app/components/loading/Loading'
import './ListView.scss'
import LazyImage from 'src/app/components/lazyimg/Lazy-img'
import Scroll from 'src/app/components/scroll/Scroll'
import {getData} from 'common/js/dom.js'

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
    getItem: Function
}

interface touchType{
    y1 : number;
    y2 : number;
    anchorIndex : string;
}

interface ListViewState{
    currentIndex : number,
    touch : touchType,
    listHeight:Array<any>
}

class ListView extends Component<ListViewProps, ListViewState>{
    listview:React.RefObject<Scroll>;
    listGroup:React.RefObject<HTMLUListElement>;
    fixed:React.RefObject<HTMLDivElement>;
    timer:any
    constructor(props: ListViewProps){
        super(props);
        this.listview = React.createRef();
        this.listGroup = React.createRef();
        this.fixed = React.createRef();
        this.state = {
            listHeight:[],
            currentIndex: 0,
            touch:{
                y1 : 0,
                y2 : 0,
                anchorIndex: ""
            }
        }
    }
    componentDidMount(){
        this.timer = setTimeout(()=>{
            this._calculateHeight()
        },1000)
    }

    componentWillUnmount(){
        clearTimeout(this.timer)
    }

    refresh = () => {
        this.listview.current && this.listview.current.refresh()
    }

    _calculateHeight() {
        if(!this.listGroup.current){
            return
        }
        let listHeight = []
        const list = this.listGroup.current.children
        let height = 0
        listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            height += item.clientHeight
            listHeight.push(height)
        }
        this.setState({
            listHeight
            }
        )
    }

    scrollHandler = (pos : {x:number,y:number}) => {
        // console.log("this",this)
        if(Object.is(pos.y,NaN) || !this.fixed.current){
            return
        }
        let newY = pos.y;
            const listHeight = this.state.listHeight;
            // 当滚动到顶部，newY>0
            if (newY > 0) {
                this.setState({
                    currentIndex : 0
                })
                return
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (-newY >= height1 && -newY < height2) {
                    this.setState({
                        currentIndex : i
                    })
                    let diff = height2 + newY;
                    let fixedTop = (diff > 0 && diff < TITLE_HEIGHT) ? diff - TITLE_HEIGHT : 0
                    this.fixed.current.style.transform = `translate3d(0,${fixedTop}px,0)`
                    return
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
        this.setState({
            currentIndex : listHeight.length - 2
        })
    }

    onTouchStartHandler : React.TouchEventHandler<HTMLDivElement>= (e) => {
        if(!this.listGroup.current)return
        let anchorIndex = getData(e.target, 'index')
        if(anchorIndex){
            let firstTouch = e.touches[0]
            let touch = Object.assign({}, this.state.touch,{
                y1: firstTouch.pageY,
                anchorIndex
            })
            this.setState({
                currentIndex:anchorIndex,
                touch
            })
            this.listview.current && this.listview.current.scrollToElement(this.listGroup.current.childNodes[anchorIndex], 0)
        }else{
            return
        }
    }

    onTouchMoveHandler = (e: TouchEvent<Element>)=>{
        e.stopPropagation();
        let firstTouch = e.touches[0]
        let touch = Object.assign({}, this.state.touch,{
            y2: firstTouch.pageY
        })
        this.setState({touch},()=>{
            if(!this.listGroup.current)return
            let delta = (this.state.touch.y2 - this.state.touch.y1) / ANCHOR_HEIGHT | 0
            let anchorIndex = parseInt(this.state.touch.anchorIndex) + delta
            if(anchorIndex<0){
                anchorIndex = 0;
            }else if(anchorIndex > this.listGroup.current.childNodes.length-1){
                anchorIndex = this.listGroup.current.childNodes.length-1;
            }else if(Object.is(anchorIndex, NaN)){
                return
            }
            this.setState({currentIndex:anchorIndex})
            this.listview.current && this.listview.current.scrollToElement(this.listGroup.current.childNodes[anchorIndex], 0)
        })
    }

    selectItem = (item : any) => {
        this.props.getItem(item)
    }

    render(){
        const {data} = this.props;
        const {currentIndex} = this.state;
        let shortcutList=data.map((group) => {
            return group.title.substr(0, 1)
        });
        return(
            <Scroll className="listview" ref={this.listview} scrollHandler={this.scrollHandler} probeType={3}>
                <ul ref={this.listGroup}>
                    {
                        !! data.length && data.map((group:{title:string,items:Array<any>}, index)=>(
                            <li className="list-group" key={index} >
                                <h2 className="list-group-title">{group.title}</h2>
                                <ul>
                                    {
                                        !! group.items.length && group.items.map((item:any, index:number)=>(
                                            <li className="list-group-item" key={index} onClick={()=>{this.selectItem(item)}}>
                                                <LazyImage
                                                    className="avatarListLazy avatar"
                                                    containerClassName="listview"
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
                <div className="list-shortcut" onTouchStart={this.onTouchStartHandler} onTouchMove={this.onTouchMoveHandler}>
                    <ul>
                        {
                            !!shortcutList.length && shortcutList.map((item, index)=>{
                                let className = "item" + (currentIndex === index? " current" : "");
                                return <li className={className} key={index} data-index={index}>{item}</li>
                            })
                        }
                    </ul>
                </div>
                <div className="list-fixed" ref={this.fixed}>
                    <div className="fixed-title"> {data[currentIndex] ? data[currentIndex].title : ''}</div>
                </div>
                    {
                        !data.length &&
                        <div className="loading-container">
                            <Loading />
                        </div>
                    }
            </Scroll>
        )
    }
}

export default ListView

