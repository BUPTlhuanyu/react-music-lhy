/**
 * @Description: 在使用该组件时需要传入的必选参数为className
 *                 className中第一个class是用于选择需要懒加载的元素，其他的class则是表示样式
 * @author: liaohuanyu
 * @date 2019/2/1
*/
import React,{Component, useRef} from "react";
import LazyLoad from "common/js/lazyload.es2015.js"
import logo from "./logo@2x.png"

import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount'

interface LazyImageProps{
    selector: string,
    className:string,
    alt?:string,
    src?:string,
    srcset?:string,
    sizes?:string,
    width?:string,
    height?:string,
    root:Element | null
}

interface LazyImageState{

}

function LazyImage(props: LazyImageProps){
    const lazyLoadInstance: React.MutableRefObject<any> = useRef(null)
    useDidMountAndWillUnmount(() => {
      const lazyloadConfig = {
        elements_selector: props.selector,
        container: props.root,
        threshold:0
      };
      lazyLoadInstance.current = new LazyLoad(lazyloadConfig);
      lazyLoadInstance.current.update();
    })
    return (
        <img
            alt={props.alt}
            className={props.className}
            src={logo}
            data-src={props.src}
            data-srcset={props.srcset}
            data-sizes={props.sizes}
            width={props.width}
            height={props.height}
        />
    )
}

export default LazyImage;
