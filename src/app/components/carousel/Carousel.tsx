/**
 * bug： 在从其他路由页面跳转回来的时候会出现闪屏的情况，因为 Recommend 已经将 src 设置到 img 上，导致图片加载完之后就立即展示，
 *       此时的是原始图片宽高，此时浏览器才将图片的宽高设置上去，网速好的时候导致图片先展示原来的大小然后被回流到指定大小
 * fix： 为了解决上述问题，需要在设置宽高之后再设置 src， 所以轮播图组件需要接收一个 setState 来通知父组件已经设置好宽高可以设置 src 了
 *
 * bug： 上述解决方案又一个问题，创建 better-scroll 实例的时候，bs 内部会 cloneNode 克隆元素，因为此时元素没有 src 属性，所以克隆得到的元素中图片 src 是不正确的，导致轮播图渲染不正确
 *
 * fix： 为了解决上面的两个问题，Recommend 需要将 src 设置到 img 上，但是 visible 为 hidden，等 bs 实例化之后再展示
 */

import React, {useRef, useState, useCallback} from 'react';
import './carousel.scss';
import Carouseler from './carouseler';

import useDidMountAndWillUnmount from 'hooks/useDidMountAndWillUnmount';

interface componentsProps {
    children: any;
}

const BSoptions = {
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: {
        loop: true,
        threshold: 0.3,
        speed: 400
    },
    bounce: false,
    stopPropagation: true,
    click: true
};

function Carousel(props: componentsProps) {
    const [showCarousel, setShowCarousel] = useState<boolean>(false);
    const [dots, setDots] = useState<number[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

    /* ref */
    const carousel: React.RefObject<HTMLDivElement> = useRef(null);
    const carouselGroup: React.RefObject<HTMLDivElement> = useRef(null);

    /* 初始化 点 */

    const _initDots = useCallback(
        () => {
            setDots(new Array(props.children.length).fill(0));
        },
        [props.children, setDots]
    );

    /* 挂载阶段 */
    useDidMountAndWillUnmount(() => {
        // eslint-disable-next-line
        Logger.green('Carousel');
        if (!carousel.current && !carouselGroup.current) {
            return;
        }
        let carouseler = new Carouseler(
            carousel.current as HTMLElement, // 轮播图每个图片的容器
            carouselGroup.current as HTMLElement, // 轮播图的容器
            setCurrentPageIndex, // 当前播放到第几张
            BSoptions // BS 的选项
        );
        setShowCarousel(true); // 解决图片闪烁
        carouseler.init();
        _initDots();
        return carouseler.cleanUp; // 注意这里return的函数会在组件卸载之前执行，这个函数会被保存在一个变量destory上，执行destory的时候，函数内部this如果没有显示绑定那么指向全局对象，严格模式下是undefined。如果被显示绑定了，比如bind那么this就是指向bind的那个对象，bind的原理就用到了闭包
    });

    return (
        <div
            className="carousel"
            ref={carousel}
            style={showCarousel ? {visibility: 'visible'} : {visibility: 'hidden'}}
        >
            <div className="carousel-group" ref={carouselGroup}>
                {props.children}
            </div>
            <div className="dots">
                {dots.length
                    && dots.map((item, index) => (
                        <span className={'dot' + (currentPageIndex === index ? ' active' : '')} key={index} />
                    ))}
            </div>
        </div>
    );
}

export default Carousel;
