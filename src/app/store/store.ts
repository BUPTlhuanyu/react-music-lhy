import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from 'reducers/index'
const loggerMiddleware = createLogger();

let createStoreWithMiddleware:any;
if (process.env.NODE_ENV === 'development') {
    createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )(createStore);
} else {
    createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware
    )(createStore);
}

export default function configureStore(initialState?:any) {
    return createStoreWithMiddleware(reducer, initialState);
}

