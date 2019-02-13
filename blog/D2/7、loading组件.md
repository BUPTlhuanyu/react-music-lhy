# loading组件 #

选用纯函数组件实现：

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

用法：<Loading/>中没有text传入props的时候，默认的loading文本是正在载入。

	<div className="recommend">
            <Scroll scrollStyle="recommend-content">
                <div>
                    <div className="slider-wrapper">
                      	...
                    </div>
                    <div className="recommend-list">
                        ...
                    </div>
                </div>
                {
                    !discList.length &&
                    <div className="loading-container" >
                        <Loading/>
                    </div>
                }
            </Scroll>
    </div>