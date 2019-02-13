### 构建store存储的state数据结构 ###
state的数据结构为：

	｛
		singer:singer
	｝

因此对应的reducers/index.ts为

	import { combineReducers } from "redux";
	import singer from './singer'

	const reducer = combineReducers({
	    singer:singer
	})

	export default reducer

reducers/singer.ts

	import * as types from 'actions/actionsTypes'

	const singer = (state:any=null, action:any) => {
	    switch(action.type){
	        case types.SET_SINGER:
	            return action.singer
	        default:
	            return state
	    }
	}

	export default singer

### 创建store对象，注入根组件 ###
store/store.ts

	import { createStore } from 'redux';
	import reducer from 'reducers/index';
	const store = createStore(reducer);
	export default store

项目入口文件index.ts

	import { Provider } from "react-redux";
	import configureStore from "store/store"
	ReactDOM.render(
	    <Provider store={store}>
	        <BrowserRouter>
	            <App />
	        </BrowserRouter>
	    </Provider>,
	    document.getElementById('root')
	);

### 在组件中获取store中存储的state的数据 ###
singer-detail.tsx

	import { connect } from 'react-redux'
	import SingerClass from 'common/js/singer.js'
	interface singerDetailPropType{
	    singer:SingerClass
	}
	class SingerDetail extends Component<singerDetailPropType, singerDetailStateType>{
		...
	    _getSingerDetail = () => {
			//通过组件的props获取store中存储的state的数据
			console.log(this.props.singer)
	    }
		...
	}

	//将store中存储的state的singer数据映射到组件props中的singer中
	//mapStateToProps函数返回的对象会被merge到组件的props中
	const mapStateToProps = (state:any) => (
	    {
		        singer    :   state.singer
				  |		       \_______/
			 props.singer    store中的state
	    }
	)

	export default connect(mapStateToProps)(SingerDetail)

### 从组件dispatch数据到store中的state ###
singer.tsx

	import { connect } from 'react-redux'
	import {  Route, withRouter } from 'react-router'
	import * as types from 'actions/actionsTypes'
	class SingerBase extends Component<singerProps, singerState>{
		...

	    selectSinger = (singer:SingerClass) => {
	        //
	        this.props.setSinger(singer)
	    }
		...
	}
	const Singer = withRouter(SingerBase as any);

	//在组件的props中注入一个setSinger方法，该方法接收一个singer参数，
	该参数会被作为一个action对象的singer的数据，并传入dispatch方法中。
	一旦执行了这个dispatch，redux会自动根据这个action对象调用根reducer，
	reducer会根据action.type返回一个数据，并赋值给store中存储的state的singer对象上
	//结合reducers/index.ts以及reducers/singer.ts很容易明白
	const mapDispatchToProps = (dispatch:any, ownProps:any) => {
	    return {
	        setSinger: (singer:SingerClass) => (
	            dispatch({
					type:types.SET_SINGER,
					singer:singer
				})
	        )
	    }
	}

	export default connect(() => ({}), mapDispatchToProps)(Singer)

为了更加灵活的配置action，可以创建action生成函数来代替dispatch(actionObj)中的actionObj，即dispatch(actionCreator(singer))。

actions/singer.ts

	import * as types from './actionsTypes'
	import SingerClass from 'common/js/singer.js'

	export const setSinger = (singer:SingerClass) => {
	    return {
	        type: types.SET_SINGER,
	        singer
	    }
	}

更改singer.tsx

	import { connect } from 'react-redux'
	import {setSinger} from 'actions/singer'
	import {  Route, withRouter } from 'react-router'
	class SingerBase extends Component<singerProps, singerState>{
		...

	    selectSinger = (singer:SingerClass) => {
	        //
	        this.props.setSinger(singer)
	    }
		...
	}
	const Singer = withRouter(SingerBase as any);

	const mapDispatchToProps = (dispatch:any, ownProps:any) => {
	    return {
	        setSinger: (singer:SingerClass) => (
	            dispatch(setSinger(singer))
	        )
	    }
	}

	export default connect(() => ({}), mapDispatchToProps)(Singer)

### 总结 ###
先在根reducer中设计state的数据结构，然后分别在各个组件中利用connect(() => ({}), mapDispatchToProps)(Singer)为state添加数据,利用connect(() => ({}), mapDispatchToProps)(Singer)获取state中的数据。