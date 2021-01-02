/**
 * 这里可以构建布局了， 如果routes非常复杂，那么可以将routes作为一棵来单独管理
 */
import React from 'react';
import {Switch, Route, Redirect} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

/* 布局方式： 可以是一个函数或者多个布局组件 */
import BasicLayout from 'src/app/layouts';

import reactLazyHOC from 'src/app/components/react-lazy-hoc/ReactLazyHOC';
import Loading from 'src/app/components/loading/Loading';

import Recommend from 'src/app/pages/recommend/Recommend';
const UserCenter = reactLazyHOC(React.lazy(() => import('src/app/pages/user-center/UserCenter')), <Loading />);
const Search = reactLazyHOC(React.lazy(() => import('src/app/pages/search/Search')), <Loading />);
const Singer = reactLazyHOC(React.lazy(() => import('src/app/pages/singer/Singer')), <Loading />);
const Rank = reactLazyHOC(React.lazy(() => import('src/app/pages/rank/Rank')), <Loading />);

const SingerDetail = reactLazyHOC(
    React.lazy(() => import('src/app/components/singer-detail/SingerDetail')),
    <Loading />
);
const TopList = reactLazyHOC(React.lazy(() => import('src/app/pages/rank/components/top-list/TopList')), <Loading />);

function renderRoutes() {
    // 这里会有一些逻辑，根据renderRoutes的参数来确定用哪一种layout来布局
    return (
        <BrowserRouter>
            <BasicLayout>
                <Switch>
                    {/* 配置默认路由 */}
                    <Route exact path="/" render={() => <Redirect to="/recommend" />} />
                    <Route path="/recommend" component={Recommend} />
                    {/* <Route exact path="/recommend/:id" component={Disc}/> */}
                    <Route exact path="/rank" component={Rank} />
                    <Route exact path="/rank/:id" component={TopList} />
                    <Route exact path="/search" component={Search} />
                    <Route exact path="/singer" component={Singer} />
                    <Route exact path="/singer/:id" component={SingerDetail} />
                    <Route exact path="/user" component={UserCenter} />
                </Switch>
            </BasicLayout>
        </BrowserRouter>
    );
}

export default renderRoutes;
