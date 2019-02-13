# Singer.tsx #

	import React,{ Component } from 'react'
	import './Singer.scss'
	import {getSingerList} from 'api/singer.js'
	import {ERR_OK} from 'api/config'
	import ListView from 'reuse/listview/ListView'
	import SingerClass from 'common/js/singer.js'

	interface hotType{
	    title:string,
	    items:Array<any>
	}

	class mapType {
	    hot:hotType;
	    [index: string]: hotType;
	    constructor(hotName:string){
	        this.hot={
	            title:hotName,
	            items:[]
	        }
	    }
	}

	const HOT_SINGER_LEN = 10
	const HOT_NAME = '热门'

	interface singerProps{

	}

	interface singerState{
	    singers: Array<any>
	}

	class Singer extends Component<singerProps, singerState>{
	    constructor(props: singerProps){
	        super(props);
	        this.state = {
	            singers: []
	        }
	    }
	    componentDidMount(){
	        this._getSingerList()
	    }
	    _getSingerList() {
	        getSingerList().then((res) => {
	            if (res.code === ERR_OK) {
	                this.setState({
	                    singers: this._normalizeSinger(res.data.list)
	                })
	            }
	        })
	    }
	    _normalizeSinger(list:Array<any>) {
	        let map = new mapType(HOT_NAME);
	        list.forEach((item, index) => {
	            if (index < HOT_SINGER_LEN) {
	                map.hot.items.push(new SingerClass({
	                    name: item.Fsinger_name,
	                    id: item.Fsinger_mid
	                }))
	            }
	            const key = item.Findex
	            if (!map[key]) {
	                map[key] = {
	                    title: key,
	                    items: []
	                }
	            }
	            map[key].items.push(new SingerClass({
	                name: item.Fsinger_name,
	                id: item.Fsinger_mid
	            }))
	        })
	        // 为了得到有序列表，我们需要处理 map
	        let ret = []
	        let hot = []
	        for (let key in map) {
	            let val = map[key]
	            if (val.title.match(/[a-zA-Z]/)) {
	                ret.push(val)
	            } else if (val.title === HOT_NAME) {
	                hot.push(val)
	            }
	        }
	        ret.sort((a, b) => {
	            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
	        })
	        return hot.concat(ret)
	    }
	    render(){
	        const {singers} = this.state
	        return(
	            <div className="singer">
	                <ListView data={singers}/>
	            </div>
	        )
	    }
	}

	export default Singer

这里需要注意用typescript定义复杂数据结构类型：

	interface hotType{
	    title:string,
	    items:Array<any>
	}

	class mapType {
	    hot:hotType;
	    [index: string]: hotType;
	    constructor(hotName:string){
	        this.hot={
	            title:hotName,
	            items:[]
	        }
	    }
	}

定义类的时候，可以用 [index: string]: hotType; 的方式来定义类的属性可以自由添加属性名为字符串类型，值为hotType类型。