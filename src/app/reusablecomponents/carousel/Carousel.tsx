import React,{ Component } from 'react'
import './carousel.scss'
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom.js'

interface componentsProps{
    children: any
}

interface componentsState{
    loop:boolean ,
    threshold:number ,
    autoPlay:boolean ,
    interval:number ,
    showDot:boolean ,
    click:boolean ,
    speed:number,
    currentPageIndex:number,
    dots:Array<any>
}

// let resizeTimer:any=null;
// let carouselBS:any = null;
// let children:any = null;
// let timer:any=null;

export default class Carousel extends Component<componentsProps, componentsState>{
    carousel:any;
    carouselGroup:any;
    children:any;
    resizeTimer:any;
    carouselBS:any;
    timer:any;
    constructor(props:componentsProps){
        super(props);
        this.carousel = React.createRef();
        this.carouselGroup = React.createRef();
        this.resizeTimer=null;
        this.carouselBS = null;
        this.children = null;
        this.timer=null;
        this.state = {
            loop:true,
            autoPlay:true,
            interval:4000,
            showDot:true,
            click:true,
            threshold:0.3,
            speed:400,
            dots: [],
            currentPageIndex: 0,
        }
    }

    componentDidMount(){
        // console.log("Carouseld的componentDidMount")
        this.update();

        window.addEventListener('resize', () => {
            if (!this.carouselBS || !this.carouselBS.enabled) {
                return
            }
            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => {
                if (this.carouselBS.isInTransition) {
                    this._onScrollEnd()
                } else {
                    if (this.state.autoPlay) {
                        this._play()
                    }
                }
                this.refresh()
            }, 60)
        })
    }

    componentWillUnmount(){
        clearTimeout(this.resizeTimer);
        clearTimeout(this.timer);
    }

    update() {
        if (this.carouselBS) {
            this.carouselBS.destroy()
        }
        this.init()
    }
    init() {
        clearTimeout(this.timer)
        this.setState({
            currentPageIndex: 0
        })
        this._setSlideWidth()
        if (this.state.showDot) {
            this._initDots()
        }
        this._initSlide()
        if (this.state.autoPlay) {
            this._play()
        }
    }
    _initDots() {
        this.setState({
            dots: new Array(this.children.length).fill(0)
        })
    }
    _initSlide() {
        this.carouselBS = new BScroll(this.carousel.current, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
                loop: this.state.loop,
                threshold: this.state.threshold,
                speed: this.state.speed
            },
            bounce: false,
            stopPropagation: true,
            click: this.state.click
        })
        this.carouselBS.on('scrollEnd', this._onScrollEnd.bind(this))
        this.carouselBS.on('touchEnd', () => {
            if (this.state.autoPlay) {
                this._play()
            }
        })
        this.carouselBS.on('beforeScrollStart', () => {
            if (this.state.autoPlay) {
                clearTimeout(this.timer)
            }
        })
    }
    _setSlideWidth(isResize:boolean=false) {
        this.children = this.carouselGroup.current.children
        // console.log(this.children.length,this.children[0])
        let width = 0
        let sliderWidth = this.carousel.current.clientWidth
        // console.log(sliderWidth)
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            addClass(child, 'carousel-item')

            child.style.width = sliderWidth + 'px'
            width += sliderWidth
        }
        if (this.state.loop && !isResize) {
            width += 2 * sliderWidth
        }
        this.carouselGroup.current.style.width = width + 'px'
    }
    _play() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.carouselBS.next()
        }, this.state.interval)
    }
    refresh() {
        this._setSlideWidth(true)
        this.carouselBS.refresh()
    }
    _onScrollEnd() {
        let pageIndex = this.carouselBS.getCurrentPage().pageX;
        // console.log(this)
        this.setState({
            currentPageIndex:pageIndex
        })
        if (this.state.autoPlay) {
            this._play()
        }
    }
    render(){
        // console.log("Carouseld的render")
        const {dots , currentPageIndex} = this.state;
        // console.log(dots.length,currentPageIndex)
        // console.log("dot"+ (currentPageIndex===1?" active":""))
        return (
            <div className="carousel" ref={this.carousel}>
                <div className="carousel-group" ref={this.carouselGroup}>
                    {this.props.children}
                </div>
                <div className="dots">
                    {
                        dots.length && dots.map((item, index)=>(
                            <span className={"dot"+ (currentPageIndex===index?" active":"")} key={index}/>
                            )
                        )
                    }
                </div>
            </div>
        )
    }
}