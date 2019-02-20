## typescript ##
[他山之石可以攻玉](https://juejin.im/post/5bab4d59f265da0aec22629b)

## 无状态组件 ##
在 React 的声明文件中 已经定义了一个 SFC 类型，使用这个类型可以避免我们重复定义 children、 propTypes、 contextTypes、 defaultProps、displayName 的类型。因此，如果组件中用到上述类型，也无需重复定义。

	interface NoResultProps{
	    title?:string
	}
	
	const NoResult : React.SFC<NoResultProps> = ({title = ''}) => {
	    return (
	        <div className="no-result">
	            <div className="no-result-icon"></div>
	            <p className="no-result-text">{title}</p>
	        </div>
	    )
	}
	
	export default NoResult

## 有状态组件 ##

	class DiscBase extends Component<DiscBasePropType, DiscBaseStateType>{
	    readonly state : Readonly<DiscBaseStateType>
	    constructor(props:DiscBasePropType){
	        super(props)
	        this.state = {
	            showMusicList: true,
	            songs:[]
	        }
	    }
		...
	｝

如之前推荐的文章介绍的写法，为state设置只读，查看react的d.ts文件可知：

    readonly props: Readonly<{ children?: ReactNode }> & Readonly<P>;
    state: Readonly<S>;
	...
	componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;

react定义的是props是不能直接赋值为一个新对象并且属性也是只读的，state是可以直接赋值为一个新对象，但是属性是只读的。如下在componentDidMount中直接赋值为一个新对象，在不写readonly的时候是允许的，state直接赋值为一个新对象，这样将不会重新渲染一个组件

        this.state={
            showMusicList: false,
            songs:this._normalizeSongs(res.cdlist[0].songlist)
        }

因此当直接将state直接赋值为一个新对象的时候，虽然不会报错，但会造成后期潜在的bug，无法渲染，因此上述声明非常有必要的。

## react事件类型 ##
例子

    onChangeHandler : React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({
            query: e.target.value
        })
        // 如果只需要e.target.value, 则这里不需要e.persist()
        // 如果异步回调函数需要对事件做处理，则需要e.persist();
        // e.persist();
        this.queryHandlerDebounce(e.target.value)
    }

## 媒体事件类型 ##
对于audio标签的currentTime的获取需要对e.target断言为HTMLMediaElement类型

    updateTime : React.ReactEventHandler<HTMLAudioElement>= (e) => {
        const { currentTime } : { currentTime: number } = e.target as HTMLMediaElement;
        this.setState({
            currentTime : currentTime
        })
    }