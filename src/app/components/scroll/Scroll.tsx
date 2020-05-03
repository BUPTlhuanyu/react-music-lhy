/**
 * @Description: 使用组件Scroll的时候，可以当做正常标签使用，className依然表示class
 *                  scrollHandler获取滑动位置
 * @author: liaohuanyu
 * @date 2019/2/1
*/
import React, {Component, ReactNode} from 'react'
import BScroll from 'better-scroll'

interface scrollProps{
    children?:ReactNode,
    className?:string,
    scrollHandler?:Function,
    probeType?:number,
    pullUp?:boolean,
    pullUpHandler?:Function
}

interface scrollState{
    click:boolean,
    probeType:number,
    listenScroll:boolean
}

export default class Scroll extends Component<scrollProps, scrollState>{
    wrapper:React.RefObject<HTMLDivElement>;
    wrapperBs:any;
    constructor(props: scrollProps){
        super(props);
        this.wrapper = React.createRef();
        this.wrapperBs = null;
        this.scrollTo = this.scrollTo.bind(this);
        this.scrollToElement = this.scrollToElement.bind(this);
        this.state = {
            click:true,
            listenScroll:true,
            probeType: props.probeType || 2
        }
    }
    componentDidMount(){
        setTimeout(() => {
            // console.log(1)
            this._initScroll()
        }, 20)
    }

    componentWillUnmount(){
        this.stop()
    }

    _initScroll = ()=> {
        if (!this.wrapper.current) {
            return
        }
        this.wrapperBs = new BScroll(this.wrapper.current, {
            probeType: this.state.probeType,
            click: this.state.click
        })
        let {scrollHandler,pullUpHandler} = this.props;
        // console.log(this.wrapperBs)
        if (this.state.listenScroll) {
            this.wrapperBs.on('scroll', (pos:Object) => {
                scrollHandler && scrollHandler(pos)
            })
        }

        if (this.state.listenScroll) {
            this.wrapperBs.on('scrollEnd', (pos:Object) => {
                scrollHandler && scrollHandler(pos)
            })
        }

        if (this.props.pullUp) {
            this.wrapperBs.on('scrollEnd', () => {
                if (this.wrapperBs.y <= (this.wrapperBs.maxScrollY + 50)) {
                    pullUpHandler && pullUpHandler()
                }
            })
        }

        // if (this.state.beforeScroll) {
        //     this.wrapperBs.on('beforeScrollStart', () => {
        //         this.$emit('beforeScroll')
        //     })
        // }
    }
    stop = () =>{
        this.wrapperBs && this.wrapperBs.stop()
    }
    refresh = () => {
        this.wrapperBs && this.wrapperBs.refresh()
    }
    scrollTo(...args:any){
        this.wrapperBs && this.wrapperBs.scrollTo.apply(this.wrapperBs, args)
    }
    scrollToElement(...args:any){
        this.wrapperBs && this.wrapperBs.scrollToElement.apply(this.wrapperBs, args)
    }
    render(){
        return (
            <div ref={this.wrapper} className={this.props.className}>
                {this.props.children}
            </div>
        )
    }
}