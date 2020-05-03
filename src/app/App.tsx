import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import ReactLazyHOC from 'src/app/components/react-lazy-hoc/ReactLazyHOC'
import Loading from 'src/app/components/loading/Loading'

import BasicLayout from 'src/app/layouts'

import Recommend from 'src/app/pages/recommend/Recommend'
const UserCenter = ReactLazyHOC(React.lazy(() => import("src/app/pages/user-center/UserCenter")), <Loading />);
const Search = ReactLazyHOC(React.lazy(() => import('src/app/pages/search/Search')), <Loading />);
const Singer = ReactLazyHOC(React.lazy(() => import('src/app/pages/singer/Singer')), <Loading />);
const Rank = ReactLazyHOC(React.lazy(() => import('src/app/pages/rank/Rank')), <Loading />);

class App extends Component {
  render() {
    return (
      <BasicLayout >
      <Switch>
          {/*配置默认路由*/}
          <Route
              exact
              path="/"
              render={() => <Redirect to="/recommend" />}
          />
          <Route path="/recommend" component={Recommend}/>
          <Route path="/rank" component={Rank}/>
          <Route path="/search" component={Search}/>
          <Route path="/singer" component={Singer}/>
          <Route path="/user" component={UserCenter}/>
      </Switch>
    </BasicLayout>
    );
  }
}

export default App;