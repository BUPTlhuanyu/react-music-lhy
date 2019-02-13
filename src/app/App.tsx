import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Header from 'components/header/Header'
import Tab from 'components/tab/Tab'
import Rank from 'components/rank/Rank'
import Recommend from 'components/recommend/Recommend'
import Search from 'components/search/Search'
import Singer from 'components/singer/Singer'
import Player from 'components/player/Player'
import UserCenter from "./components/user-center/UserCenter";

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
