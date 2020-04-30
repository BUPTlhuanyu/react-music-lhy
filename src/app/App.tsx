import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import ReactLazyHOC from 'reuse/react-lazy-hoc/ReactLazyHOC'
import Loading from 'reuse/loading/Loading'

import Header from 'components/header/Header'
import Tab from 'components/tab/Tab'
import Player from 'components/player/Player'
import Recommend from 'components/recommend/Recommend'

const UserCenter = ReactLazyHOC(React.lazy(() => import("components/user-center/UserCenter")), <Loading />);
const Search = ReactLazyHOC(React.lazy(() => import('components/search/Search')), <Loading />);
const Singer = ReactLazyHOC(React.lazy(() => import('components/singer/Singer')), <Loading />);
const Rank = ReactLazyHOC(React.lazy(() => import('components/rank/Rank')), <Loading />);

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
                  render={() => <Redirect to="/recommend" />}
              />
              <Route path="/recommend" component={Recommend}/>
              <Route path="/rank" component={Rank}/>
              <Route path="/search" component={Search}/>
              <Route path="/singer" component={Singer}/>
          </Switch>
          <Route path="/user" component={UserCenter}/>
          <Player/>
      </div>
    );
  }
}

export default App;