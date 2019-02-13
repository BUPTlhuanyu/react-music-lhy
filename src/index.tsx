import React from 'react';
import ReactDOM from 'react-dom';
import './common/style/index.scss';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configureStore from "store/store"

// const FastClick = require('fastclick');
// FastClick.attach(document.body);

import fastClick from 'fastclick';
fastClick.attach(document.body);

import { BrowserRouter } from 'react-router-dom'

const store = configureStore()

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
