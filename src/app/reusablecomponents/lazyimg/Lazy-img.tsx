/**
 * @Description: 在使用该组件时需要传入的必选参数为className
 *                 className中第一个class是用于选择需要懒加载的元素，其他的class则是表示样式
 * @author: liaohuanyu
 * @date 2019/2/1
*/
import React,{Component} from "react";
import LazyLoad from "common/js/lazyload.es2015.js"
import logo from "./logo@2x.png"

interface LazyImageProps{
    className:string,
    alt?:string,
    src?:string,
    srcset?:string,
    sizes?:string,
    width?:string,
    height?:string,
    containerClassName?:string
}

interface LazyImageState{

}


export class LazyImage extends Component <LazyImageProps, LazyImageState> {
    lazyLoadInstance:any
    constructor(props:LazyImageProps){
        super(props);
        this.lazyLoadInstance = null;
    }

    // Update lazyLoad after first rendering of every image
    componentDidMount() {
        // console.log('lazyLoadInstance')
        if(!this.lazyLoadInstance){
            let container;
            try{
                container = document.getElementsByClassName(this.props.containerClassName+"")[0]
            }
            catch(err){
                container = null;
            };
            const lazyloadConfig = {
                elements_selector: "."+this.props.className.split(" ")[0],
                container: container,
                threshold:0
            };
            this.lazyLoadInstance = new LazyLoad(lazyloadConfig);
        }
        this.lazyLoadInstance.update();
    }
    render() {
        const { alt, srcset, sizes, width, height, className } = this.props;
        let src = this.props.src ? this.props.src : logo;
        return (
            <img
                alt={alt}
                className={className}
                src={logo}
                data-src={src}
                data-srcset={srcset}
                data-sizes={sizes}
                width={width}
                height={height}
            />
        );
    }
}

export default LazyImage;
