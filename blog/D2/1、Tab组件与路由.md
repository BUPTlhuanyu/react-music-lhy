# Index.js #
关键代码如下：

	import fastclick from 'fastclick'
	fastclick.attach(document.body);

	import { BrowserRouter } from 'react-router-dom'

	ReactDOM.render(
	    <BrowserRouter>
	        <App />
	    </BrowserRouter>,
	    document.getElementById('root')
	);

fastclick插件用于消除移动端300ms延迟，BrowserRouter为[react-router](https://github.com/ReactTraining/react-router)4.3提供的API，利用HTML5的history API使UI组件与URL同步。react-router4+与redux一同使用的时候，用[Connected React Router](https://github.com/supasate/connected-react-router)代替[react-router-redux](https://github.com/reactjs/react-router-redux)来使得router与store的同步。

#### 存在的问题一：fastclick的typescript类型声明文件出错 ####
修改之前会出现：
Property 'attach' does not exist on type 'typeof fastclick'

attach不在fastclick声明文件中的类型不存在。

修改node——module中@type下fastclick相应文件，详细可阅读[github](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/6938/commits/985fe32972172ba9286ffcc02efb5be4710f954e)

#### index.d.ts ####

	// Type definitions for FastClick v1.0.3
	// Project: https://github.com/ftlabs/fastclick
	// Definitions by: Shinnosuke Watanabe <https://github.com/shinnn>
	// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

	interface FastClickObject {
	  lastTouchIdentifier: number;
	  layer: Element;
	  tapDelay: number;
	  targetElement: any;
	  touchBoundary: number;
	  touchStartX: number;
	  touchStartY: number;
	  trackingClick: boolean;
	  trackingClickStart: number;
	  destroy(): void;
	  determineEventType(targetElement: any): string;
	  findControl(labelElement: any /* EventTarget | HTMLLabelElement */): any;
	  focus(targetElement: any /* EventTarget | Element */): void;
	  getTargetElementFromEventTarget(eventTarget: EventTarget): any;
	  needsClick(target: any /* EventTarget | Element */): boolean;
	  needsFocus(target: any /* EventTarget | Element */): boolean;
	}

	interface FastClickOptions {
		touchBoundary?: number;
		tapDelay?: number;
	}

	interface FastClickStatic {
		new(layer: any, options?: FastClickOptions): FastClickObject;
		attach(layer: any, options?: FastClickOptions): FastClickObject;
	}

	declare module "fastclick" {
	    var FastClick: FastClickStatic;
	    export = FastClick;
	}

	declare var FastClick: FastClickStatic;

#### package.json ####
	{
		...
	  "typings": "index.d.ts",
	}


# APP.tsx（重点：react-router4的默认路由的写法）#
	import React, { Component } from 'react'
	import { Switch, Route, Redirect } from 'react-router'

	import Header from 'components/header/Header'
	import Tab from 'components/tab/Tab'
	import Rank from 'components/rank/Rank'
	import Recommand from 'components/recommand/Recommands'
	import Search from 'components/search/Search'
	import Singer from 'components/singer/Singer'

	class App extends Component {
	  render() {
	    return (
	      <div>
	          <Header />
	          <Tab />
	          <Switch>
	              {/*配置默认路由*/}
	              <Route
	                  exact
	                  path="/"
	                  render={() => <Redirect to="/recommand" />}
	              />
	              <Route path="/recommand" component={Recommand}/>
	              <Route path="/rank" component={Rank}/>
	              <Route path="/search" component={Search}/>
	              <Route path="/singer" component={Singer}/>
	          </Switch>
	      </div>
	    );
	  }
	}

	export default App;

由于react-router4改变了很多，相对于之前版本，4+版本更加组件化，以前版本需要创建一个单一的router文件，route之间嵌套着写，用各个组件拼装页面，页面与组件的逻辑结构一目了然，以前的写法如下：

	React.render((
	  <Router>
	    <Route path="/" component={App}>
	      {/* 当 url 为/时渲染 Dashboard */}
	      <IndexRoute component={Dashboard} />
	      <Route path="about" component={About} />
	      <Route path="inbox" component={Inbox}>
	        <Route path="messages/:id" component={Message} />
	      </Route>
	    </Route>
	  </Router>
	), document.body)

现在4+版本的将路由组件化了，直接将route写到组件中，页面与组件的逻辑结构有点不太清晰，暂时没看出这样做的好处。

# Tab.tsx #
	import React,{ Component } from 'react'
	import './Tab.scss'
	import { NavLink } from 'react-router-dom'

	class Tab extends Component{
	    render(){
	        return (
	            <div className="tab">
	                <NavLink to="/recommand" className="tab-item" activeClassName="link-selected">
	                    <span className="tab-link">推荐</span>
	                </NavLink>
	                <NavLink to="/singer" className="tab-item" activeClassName="link-selected">
	                    <span className="tab-link">歌手</span>
	                </NavLink>
	                <NavLink to="/rank" className="tab-item" activeClassName="link-selected">
	                     <span className="tab-link">排行
	                </span>
	                </NavLink>
	                <NavLink to="/search" className="tab-item" activeClassName="link-selected">
	                    <span className="tab-link">搜索</span>
	                </NavLink>
	            </div>
	        )
	    }
	}

	export default Tab;

用NavLink而不用Link的原因是，前者可以添加activeClassName，即被选择的时候会自动改变样式。