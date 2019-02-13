### withRouter在typescript下的使用 ###

利用react-router4官方提供的的withRouter进行路由跳转，在项目引入：

	import {  Route, withRouter } from 'react-router'

然后利用withRouter包裹组件：

	class SingerBase extends Component<singerProps, singerState>｛
		...
	｝
	const Singer = withRouter(SingerBase as any);

	export default Singer

接口singerProps中应该加上接口属性history，类型这里设置为any，更严格的，通过查找react-router对应的声明文件d.ts（node_module/@types/react-router/inde.d.ts文件）中可以找到history对应的类型如下：

	export interface RouterProps {
	  history: H.History;
	}

因此接口singerProps可定义为：

	interface singerProps{
	    history: any
	}

或者：

	import {RouterProps} from "react-router"
	interface singerProps{
	    history: RouterProps["history"]
	}

### 控制路由跳转 ###
在SingerBase组件中的方法控制路由跳转：

	class SingerBase extends Component<singerProps, singerState>｛
		...

		selectSinger = (singer:SingerClass) => {
       		this.props.history.push(`/somepath`);
    	}

		render(){
			return (...)
		}
	｝

### [其他方法](https://segmentfault.com/a/1190000013912862/) ###
1、利用react-router中的<Redirect>

2、利用this.context.router.history.push('/somepath')