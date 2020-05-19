/**
 * 这里可以构建布局了， 如果routes非常复杂，那么可以将routes作为一棵来单独管理
 */
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

/* 布局方式： 可以是一个函数或者多个布局组件 */
import BasicLayout from 'src/app/layouts'

import ReactLazyHOC from 'src/app/components/react-lazy-hoc/ReactLazyHOC'
import Loading from 'src/app/components/loading/Loading'


import Recommend from 'src/app/pages/recommend/Recommend'
const UserCenter = ReactLazyHOC(React.lazy(() => import("src/app/pages/user-center/UserCenter")), <Loading />);
const Search = ReactLazyHOC(React.lazy(() => import('src/app/pages/search/Search')), <Loading />);
const Singer = ReactLazyHOC(React.lazy(() => import('src/app/pages/singer/Singer')), <Loading />);
const Rank = ReactLazyHOC(React.lazy(() => import('src/app/pages/rank/Rank')), <Loading />);

function renderRoutes() {
    // 这里会有一些逻辑，根据renderRoutes的参数来确定用哪一种layout来布局
    return (
        <BrowserRouter>
            <BasicLayout >
                <Switch>
                    {/*配置默认路由*/}
                    <Route
                        exact
                        path="/"
                        render={() => <Redirect to="/recommend" />}
                    />
                    <Route path="/recommend" component={Recommend}/>
                    {/* <Route exact path="/recommend/:id" component={Disc}/> */}
                    <Route exact path="/rank" component={Rank}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/singer" component={Singer}/>
                    <Route exact path="/user" component={UserCenter}/>
                </Switch>
            </BasicLayout>
        </BrowserRouter>
    );
}

export default renderRoutes;