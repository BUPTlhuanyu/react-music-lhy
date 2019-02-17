## 基于react-transition-group的react过渡动画 ##

[react-transition-group](https://github.com/reactjs/react-transition-group)是react官方提供的动画库，[Transition的源码浅析](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-transition-group/block/D1/react-transition-group%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%B8%80)%EF%BC%9ATransition.md#3-%E4%BB%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%88%86%E6%9E%90%E7%BB%84%E4%BB%B6%E6%BA%90%E7%A0%81)，本项目中目前实现了一种场景下的过渡动画:点击标签，路由跳转，挂载与卸载需要过渡动画的组件。

项目中Disc.tsx、TopList.tsx、SingerDetail.tsx组件都属于这种场景下的需求，因此拿Disc.tsx来举例说明。

### Recommend.tsx ###

	class Recommend extends Component<Props,State>{
		...
	    selectDisc = (disc:any) => {
	        this.props.history.push(`/recommend/${disc.dissid}`);
	        this.props.setDisc(disc)
	    }
	
	    render(){
	        // console.log("Recommend的render")
	        const {recommends, discList} = this.state;
	        return(
                <div>
                    <ul>
						<li className="item" key={index} onClick={() => {this.selectDisc(item)}}/>
                    </ul>
					<Route path="/recommend/:id" component={Disc}/>
                </div>
	        )
	    }
	}

当点击 li 的时候，向history中push一个location，触发路由跳转，挂载对应的组件为Disc，此时利用CSSTransition进行过渡。

### Disc.scss ###

	.disc-transition-appear {
	  transform: translateX(100%);
	}
	.disc-transition-appear-active {
	  transform: translateX(0%);
	  transition: all 500ms ease-out;
	}
	
	//.disc-transition-enter {
	//  transform: translateX(100%);
	//}
	//.disc-transition-enter-active {
	//  transform: translateX(0%);
	//  transition: all 500ms ease-out;
	//}
	
	
	.disc-transition-exit {
	  transform: translateX(0%) scale(0.5);
	}
	.disc-transition-exit-active {
	  transform: translateX(100%) scale(1);
	  transition: all 500ms ease-in;
	}

利用appear以及exit，当组件第一次挂载的时候初始位置为.disc-transition-appear对应位置，即与原位置偏移一个宽度的位置，在原位置的右方。挂载的过程中，样式变为.disc-transition-appear-active，并且向原位置(translateX(0%))移动。即过载的过程实现从右向左滑动。最终样式.disc-transition-appear-active被移除。

当组件卸载的时候，初始位置为原位置，但是尺寸缩小，见.disc-transition-exit。卸载过程中，样式变为.disc-transition-exit-active，元素向原位置右方一个宽度的位置移动，并且尺寸逐渐增大，见.disc-transition-exit-active。

### Disc.tsx ###

	class DiscBase extends Component<DiscBasePropType, DiscBaseStateType>{
	    unmoutedFlag:boolean;
	    constructor(props:DiscBasePropType){
	        super(props)
	        this.unmoutedFlag=false
	        this.state  = {
	            showMusicList: true,
	            songs:[]
	        }
	    }
	
	    back = () => {
	        this.setState({
	            showMusicList:false
	        })
	    }
	
	    render(){
	        const { disc } = this.props;
	        const { songs } = this.state;
	        return(
	            <CSSTransition
	                in={this.state.showMusicList}
	                timeout={500}
	                classNames="disc-transition"
	                appear={true}
	                unmountOnExit
	                onExited = { () => {
	                    this.props.history.goBack()
	                } }
	            >
	                <MusicList singerName={disc.name} bgImage={disc.imgurl} songs={songs} back={this.back}/>
	            </CSSTransition>
	        )
	    }
	}

in：表示组件的状态是否翻转，即入场动画entered（appear）与退场动画exited状态之间的翻转。appear：表示第一次挂载的时候，组件是否执行过渡动画。unmountOnExit：当状态为exited的时候，是否卸载组件，本例中只用到了unmountOnExit为默认值false，是因为路由跳转，组件会被卸载所以不需要设置为true，往往unmountOnExit与appear都需要设置为true。onExited：该函数会在组件状态变为exited的时候执行，本例中会执行路由跳转，卸载组件，如果在组件实例方法back中路由跳转，无法保证组件卸载之后跳转，导致过渡动画提前中断。

