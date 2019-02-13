# 基于better-scroll的react轮播图组件 #

由于[beter-scroll](https://github.com/ustbhuangyi/better-scroll)官方给出的例子都是vue组件的实现没有react组件的实现，结合项目给出了react的轮播图组件的实现。
vue组件代码：[vue轮播图组件](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue)
better-scroll版本以及react的版本分别是

	"@types/better-scroll": "^1.12.1"
	"better-scroll": "^1.14.1"
	"react": "^16.7.0"

### 组件之间的渲染逻辑 ###
Carousel组件即为react轮播图图组件，Recommend组件是轮播图组件的父组件，通过接口请求数据存储到recommend数组中，Recommend组件的代码如下

    <div className="slider-wrapper">
        {
            recommend.length &&
            <Carousel>
                {
                    recommend.map((item, index)=>(
                            <div key={index}>
                                <a href={item.linkUrl}>
                                    <img src={item.picUrl}/>
                                </a>
                            </div>
                        )
                    )
                }
            </Carousel>
        }
    </div>
渲染顺序如下，Recommend组件render函数执行，然后执行componentDidMount获取数据，此时recommend.length为0，Carousel还没出现在Recommend组件中，当数据获得到之后运行setState更新state，因此重新又render一次，此时recommend.length不为0，开始渲染Carousel组件，同样在Carousel组件中的componentDidMount更新一次state需要额外再render一次。
![](https://t1.picb.cc/uploads/2019/01/31/VHv2dd.png)
结果如下

![](https://t1.picb.cc/uploads/2019/01/31/VHvgNu.png)

如果组件代码如下

    <div className="slider-wrapper">
            <Carousel>
                {
                    recommend.length && recommend.map((item, index)=>(
                            <div key={index}>
                                <a href={item.linkUrl}>
                                    <img src={item.picUrl}/>
                                </a>
                            </div>
                        )
                    )
                }
            </Carousel>
    </div>
渲染顺序如下，Recommend组件render函数执行，此时Carousel已经存在于父组件中，因此会先去渲染Carousel组件，执行Carousel组件中的render函数以及componentDidMount，但是这里需要注意的是componentDidMount中的setState被推入更新队列，Carousel组件中的componentDidMount执行完之后，子组件的挂载结束，然后执行父组件Recommend的componentDidMount获取数据，并将数据处理逻辑函数推入到promise队列中，因为此时子组件的setState已经在更新队列中，因此在获取数据这段时间里，子组件的state更新并重新render。数据获取到之后，执行之前加入到promise队列中的任务，执行setState函数，等该组件的state更新的时候，recommend变化recommend.length不为0，Recommend组件重新又render一次，不管子组件有没有变化都将重新render一次，这一点可以添加一个不变的组件测试出来。

**注意(测试一下很容易得到，并且这样的逻辑可以避免重复渲染)**：父子组件的生命周期以及setState的机制是：父组件的render——>子组件的首次挂载的生命周期（render到componentDidMount）——>父组件的componentDidMount——>父组件进行state的更新——>父组件render——>子组件的state的更新
![](https://t1.picb.cc/uploads/2019/01/31/VHvy01.png)
结果如下

![](https://t1.picb.cc/uploads/2019/01/31/VHvVCa.png)


### 渲染优化：依赖父组件异步数据的子组件的处理技巧 ###
**子组件如果依赖父组件的异步数据，那么可以将子组件放到条件语句中，数据还没获取到的时候先不参与到父组件的render中**

如果不将子组件放到条件语句中也可以实现同样的效果，就是在父组件设置一个标志，在数据还没更新的时候讲标志设置为0，通过props传入子组件，子组件更加props的值来判断是否对轮播图进行初始化，至于标志位1的时候才初始化，这样也可以达到效果，但是会增加很多额外的渲染。

### 允许SetState的生命周期钩子 ###

react：16.7
###### 更新阶段利用getDerivedStateFromProps根据props的值返回一个对象作为下一state，从而达到更新state的目的，用于代替componentWillReceiveProps钩子
---

挂载阶段
钩子函数 | setState
---|---
constructor() | 不能setState，因为未挂载
static getDerivedStateFromProps() | 不能setState，该生命周期返回一个对象作为新的state
render() | 不能setState，导致死循环
componentDidMount() | 能setState


更新阶段
钩子函数 | setState
---|---
static getDerivedStateFromProps() | 不能setState，该生命周期返回一个对象作为新的state
shouldComponentUpdate() | 不能setState，导致死循环
render() | 不能setState，导致死循环
getSnapshotBeforeUpdate() | 不能setState，导致死循环
componentDidUpdate() | 不能setState，导致死循环

卸载阶段

钩子函数 | setState
---|---
componentWillUnmount() | 能setState

##### 更新阶段利用getDerivedStateFromProps根据props的值返回一个对象作为下一state，从而达到更新state的目的，用于代替componentWillReceiveProps钩子 #####

### Carousel组件

```
	function hasClass(el:any, className:any) {
	    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
	    return reg.test(el.className)
	}

	function addClass(el:any, className:any) {
	    if (hasClass(el, className)) {
	        return
	    }

	    let newClass = el.className.split(' ')
	    newClass.push(className)
	    el.className = newClass.join(' ')
	}

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

	let resizeTimer:any=null;
	let carouselBS:any = null;
	let children:any = null;
	let timer:any=null;

	export default class Carousel extends Component<componentsProps, componentsState>{
	    carousel:any;
	    carouselGroup:any;
	    children:any;
	    constructor(props:componentsProps){
	        super(props);
	        this.carousel = React.createRef();
	        this.carouselGroup = React.createRef();
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
	        console.log("Carouseld的componentDidMount")
	        this.update();

	        window.addEventListener('resize', () => {
	            if (!carouselBS || !carouselBS.enabled) {
	                return
	            }
	            clearTimeout(resizeTimer)
	            resizeTimer = setTimeout(() => {
	                if (carouselBS.isInTransition) {
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

	    update() {
	        if (carouselBS) {
	            carouselBS.destroy()
	        }
	        this.init()
	    }
	    init() {
	        clearTimeout(timer)
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
	            dots: new Array(children.length).fill(0)
	        })
	    }
	    _initSlide() {
	        carouselBS = new BScroll(this.carousel.current, {
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
	        carouselBS.on('scrollEnd', this._onScrollEnd.bind(this))
	        carouselBS.on('touchEnd', () => {
	            if (this.state.autoPlay) {
	                this._play()
	            }
	        })
	        carouselBS.on('beforeScrollStart', () => {
	            if (this.state.autoPlay) {
	                clearTimeout(timer)
	            }
	        })
	    }
	    _setSlideWidth(isResize:boolean=false) {
	        children = this.carouselGroup.current.children
	        // console.log(children.length,children[0])
	        let width = 0
	        let sliderWidth = this.carousel.current.clientWidth
	        // console.log(sliderWidth)
	        for (let i = 0; i < children.length; i++) {
	            let child = children[i]
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
	        clearTimeout(timer)
	        timer = setTimeout(() => {
	            carouselBS.next()
	        }, this.state.interval)
	    }
	    refresh() {
	        this._setSlideWidth(true)
	        carouselBS.refresh()
	    }
	    _onScrollEnd() {
	        let pageIndex = carouselBS.getCurrentPage().pageX;
	        // console.log(this)
	        this.setState({
	            currentPageIndex:pageIndex
	        })
	        if (this.state.autoPlay) {
	            this._play()
	        }
	    }
	    render(){
	        console.log("Carouseld的render")
	        const {dots , currentPageIndex} = this.state;
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
```
