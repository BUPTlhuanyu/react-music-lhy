/**
 *  index在这里是做store相关的初始化处理
 *  APP组件会通过router/index来做router的初始化， APP有可能会获取数据然后传入router/index
 *  router/index会通过传入的数据来呈现不同的布局
 */
if(process.env.NODE_ENV === 'development'){
    let createColorLogger = require('src/common/js/Logger').default
    if(!createColorLogger(['red', 'green', 'blue'], 'Logger')) throw new Error('createColorLogger failed')
}


import React from 'react';
import ReactDOM from 'react-dom';
import './common/style/index.scss';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configureStore from "store/store"
import { defaultState } from 'store/stateTypes'

// const FastClick = require('fastclick');
// FastClick.attach(document.body);

import fastClick from 'fastclick';
(fastClick as any).attach(document.body);

const store = configureStore(defaultState)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
