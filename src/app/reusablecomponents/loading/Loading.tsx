import React, {Component} from 'react'
import './loading.scss'
import loadingGif from './loading.gif';

interface loadingProps{
    text?:string
}

const Loading = (props : loadingProps) => (
    <div className="loading">
        <img width="24" height="24" src={loadingGif}/>
        <p className="desc">{props.text ? props.text : "正在载入..."}</p>
    </div>
)

export default Loading
