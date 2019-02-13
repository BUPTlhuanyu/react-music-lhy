# scroll组件：移动端滚动 #
	import React, {Component} from 'react'
	import BScroll from 'better-scroll'

	interface scrollProps{
	    children:any,
	    scrollStyle:any
	}

	interface scrollState{
	    click:boolean,
	    probeType:number
	}

	export default class Scroll extends Component<scrollProps, scrollState>{
	    wrapper:any;
	    wrapperBs:any;
	    constructor(props: scrollProps){
	        super(props);
	        this.wrapper = React.createRef();
	        this.wrapperBs = null;
	        this.state = {
	            click:true,
	            probeType:1
	        }
	    }
	    componentDidMount(){
	        setTimeout(() => {
	            this._initScroll()
	        }, 20)
	    }

	    _initScroll() {
	        if (!this.wrapper.current) {
	            return
	        }
	        this.wrapperBs = new BScroll(this.wrapper.current, {
	            probeType: this.state.probeType,
	            click: this.state.click
	        })
	    }
	    refresh() {
	        this.wrapperBs && this.wrapperBs.refresh()
	    }
	    render(){
	        return (
	            <div ref={this.wrapper} className={this.props.scrollStyle}>
	                {this.props.children}
	            </div>
	        )
	    }
	}

在Recommend.tsx组件中用Scroll组件如下：

            <div className="recommend">
                    <Scroll scrollStyle="recommend-content">
                        <div>
                            <div className="slider-wrapper">
								...
                            </div>
                            <div className="recommend-list">
								...
                            </div>
                        </div>
                    </Scroll>
            </div>
打印this.wrapperBs如下：
![](https://t1.picb.cc/uploads/2019/01/31/VHvczG.png)
其中

	wrapperheight:579
	scrollerHeight:2705
	hasVerticalScroll:true

wrapperheight为BScroll.wrapper存储的DOM节点的高度，即

    <Scroll scrollStyle="recommend-content">
		...
    </Scroll>

scrollerHeight为BScroll.scroller存储的DOM节点的高度，即Scroll组件的第一个子节点，即

    <div>
		...
    </div>

**只有wrapperheight比scrollerHeight小的时候，hasVerticalScroll为true，从而运行滑动。**


