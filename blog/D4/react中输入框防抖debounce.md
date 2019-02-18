### Input防抖 ###
业务场景：input输入内容，然后通过监听onchange事件，调用this.props.queryHandler函数，将内容post到后端请求数据。

在组件挂载阶段的constructor中，利用lodash提供的防抖函数对目标函数this.props.queryHandler进行防抖处理，如果以异步方式访问事件，则需要在监听事件中对事件目标进行e.persist()处理，本例中不需要e.persist()，详见本文第二节react事件池。

	...
	import debounce from 'lodash/debounce'
	
	class SearchBox extends Component<SearchBoxPropType, SearchBoxStateType>{
	    queryHandler:any;
	    constructor(props:SearchBoxPropType){
	        super(props)
	        this.queryHandlerDebounce = debounce(this.queryHandlerDebounce, 500, {
	            leading: false,
	        });
			...
	    }

		...
	
	    onChangeHandler = (e:any) => {
	        this.setState({
	            query: e.target.value
	        })
	        // 如果只需要e.target.value, 则这里不需要e.persist()
	        // 如果异步回调函数需要对事件做处理，则需要e.persist();
	        // e.persist();
	        this.queryHandlerDebounce(e.target.value)
	    }
	
	    queryHandlerDebounce = (value:string) => {
	        this.props.queryHandler(value)
	    }
	
	    render(){
	        const { placeholder, query } = this.state
	        return(
	                <input className="box"
							...
	                       onChange={this.onChangeHandler.bind(this)}
	                />
	        )
	    }
	}
	
	export default SearchBox

### react事件池 ###
[合成事件](http://react.html.cn/docs/events.html)(SyntheticEvent)对象是通过合并得到的。 这意味着在事件回调被调用后，SyntheticEvent 对象将被重用并且所有属性都将被取消。 这是出于性能原因。 因此，您无法以异步方式访问该事件。

**注意：**
如果要以异步方式访问事件属性（特别注意，是异步方式访问事件属性，因此上面案例代码中e.persist();是可以省略的，因此e.target.value是以同步方式访问的event，然后将值传给异步处理函数），应该对事件调用 event.persist() ，这将从池中删除合成事件，并允许用户代码保留对事件的引用。

上面代码如果去掉e.persist()，报错如下：

*Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the method `stopPropagation` on a released/nullified synthetic event. This is a no-op function. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.*

打印出event为：

	bubbles:null
	cancelable:null
	currentTarget:ƒ currentTarget()
	defaultPrevented:null
	dispatchConfig:null
	eventPhase:null
	isDefaultPrevented:ƒ functionThatReturnsFalse()
	isPropagationStopped:ƒ functionThatReturnsFalse()
	isTrusted:null
	nativeEvent:null
	target:null
	timeStamp:ƒ timeStamp(event)
	type:null
	_dispatchInstances:null
	_dispatchListeners:null
	_targetInst:null

e.persist()，打印出event为：

	bubbles:true
	cancelable:false
	currentTarget:null
	defaultPrevented:false
	dispatchConfig:{phasedRegistrationNames: {…}, dependencies: Array(8)}
	eventPhase:3
	isDefaultPrevented:ƒ functionThatReturnsFalse()
	isPersistent:ƒ functionThatReturnsTrue()
	isPropagationStopped:ƒ functionThatReturnsFalse()
	isTrusted:true
	nativeEvent:InputEvent {isTrusted: true, data: "a", isComposing: false, inputType: "insertText", dataTransfer: null, …}
	target:input.box
	timeStamp:7343.699999997625
	type:"change"
	_dispatchInstances:null
	_dispatchListeners:null
	_targetInst:FiberNode {tag: 5, key: null, elementType: "input", type: "input", stateNode: input.box, …}