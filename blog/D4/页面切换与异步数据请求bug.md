## 页面切换与异步数据请求bug ##

***场景：***页面有异步数据请求，在数据返回之前，页面已经切换，因此执行this.setState的时候，组件已经卸载导致发生错误。

***解决办法：***
设置标志位，当组件卸载的时候置为false，在异步数据返回的时候，判断组件是否已经卸载，如果已经卸载那么不再setState。更进一步，也可以缓存异步数据，但是无法及时更新数据。

	class Recommend extends Component<Props,State>{
	    unmoutedFlag:boolean;
	    constructor(props:Props){
	        super(props);
	        this.unmoutedFlag=false
	        this.state = {
	            recommends: []
	        }
	    }
	    componentDidMount(){
			this._getRecommend()
	    }
	
	    componentWillUnmount(){
	        this.unmoutedFlag=true
	    }
	
	    _getRecommend() {
	        getRecommend().then((res) => {
	            if (res.code === ERR_OK && !this.unmoutedFlag) {
	                this.setState({
	                    recommends: res.data.slider
	                })
	            }
	        })
	    }
	}





