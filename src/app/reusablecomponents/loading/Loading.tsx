import React, {Component} from 'react'
import './loading.scss'
import loadingGif from './loading.gif';

interface loadingProps{
    text?:string
}

//无状态组件的类型检查,类型type SFC<P>已经有预定义的children和其他（defaultProps、displayName等等…）
// 所以不用每次都自己在编写props中定义children?: ReactNode 以及其他的属性类型
const Loading : React.SFC<loadingProps> = ({text = "正在载入..."}) => (
    <div className="loading">
        <img width="24" height="24" src={loadingGif}/>
        <p className="desc">{text}</p>
    </div>
)

export default Loading
