/* global Logger */
import './recommend.scss';
import React, {useState, useRef, useCallback} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {getRecommend, getDiscList} from 'api/recommend.js';
import {ERR_OK} from 'api/config';

import ReactLazyHOC from 'src/app/components/react-lazy-hoc/ReactLazyHOC';

import Carousel from 'components/carousel/Carousel';
import LazyImage from 'components/lazyimg/Lazy-img';
import Loading from 'components/loading/Loading';

import useDidMountAndWillUnmount from 'src/app/hooks/useDidMountAndWillUnmount';
import useScroll from 'hooks/useScroll';

import {setDisc} from 'actions/disc';
import {Props, recommendItem, Disc as IDisc} from './types';
import {Dispatch} from 'redux';

import {IStoreState} from 'store/stateTypes';

import {DiscPropType} from './component/disc/type';
/* eslint-disable-next-line */
const Disc = ReactLazyHOC<DiscPropType>(
    React.lazy(() => import('src/app/pages/recommend/component/disc/Disc')),
    <Loading />
);

/**
 * 更新内存缓存的数据
 */
let cacheData: {
    maxage: number;
    prevTime: number;
    recommends: recommendItem[];
    discList: IDisc[];
} = {
    maxage: 300000,
    prevTime: 0,
    recommends: [],
    discList: []
};
function updateCacheData(data: {recommends?: recommendItem[], discList?: IDisc[]}) {
    Object.assign(cacheData, data);
}

/**
 * 获取推荐数据，并将数据传入setState
 * @param setState 用于更新组件state
 * @param unmoutedFlag 这里需要传入ref对象，引用传递才能使得外界修改该对象属性值影响到函数内部的逻辑
 */
function getRecommendData(
    setState: React.Dispatch<React.SetStateAction<recommendItem[]>>,
    unmoutedFlag: React.MutableRefObject<boolean>
) {
    getRecommend().then(res => {
        if (res.code === ERR_OK && !unmoutedFlag.current) {
            setState(res.data.slider);
            updateCacheData({recommends: res.data.slider});
        }
    });
}
function getDiscListData(
    setState: React.Dispatch<React.SetStateAction<IDisc[]>>,
    unmoutedFlag: React.MutableRefObject<boolean>
) {
    getDiscList().then(res => {
        if (res.code === ERR_OK && !unmoutedFlag.current) {
            setState(res.data.list);
            updateCacheData({discList: res.data.list});
        }
    });
}

function Recommend(props: Props) {
    const [recommends, setRecommends] = useState<recommendItem[]>([]); // 轮播图数据
    const [discList, setDiscList] = useState<IDisc[]>([]); // 歌单列表数据
    const [disc, setDisc] = useState<IDisc | null>(null);
    const [showDisc, setShowDisc] = useState<boolean>(false);

    const recommendContainer: React.RefObject<HTMLDivElement> = useRef(null);
    const unmoutedFlag: React.MutableRefObject<boolean> = useRef(false); // 组件是否挂载
    const scrollContanier: React.MutableRefObject<HTMLDivElement | null> = useRef(null); // scrollContanier ref
    useScroll(scrollContanier, {click: true}); // 这里用不着 bs 实例，所以也不需要获取，自定义 hook 内部会手动 GC

    useDidMountAndWillUnmount(() => {
        /* 如果手动刷新或者时间超过了5分钟组件挂载了，那么就需要重新获取推荐列表以及歌单列表 */
        if (Date.now() - cacheData.prevTime > cacheData.maxage) {
            cacheData.prevTime = Date.now(); // 设置缓存的时间为当前向后端获取数据的时间
            getRecommendData(setRecommends, unmoutedFlag); // 获取轮播图推荐歌单
            getDiscListData(setDiscList, unmoutedFlag); // 获取歌单列表
        } else {
            setRecommends(cacheData.recommends);
            setDiscList(cacheData.discList);
        }
        /* 卸载的时候标记为挂载，以免组件卸载之后数据请求返回导致渲染报错 */
        return function willunmount() {
            unmoutedFlag.current = true;
            // scrollContanier.current = null             // 不需要手动清除对 dom 的引用， react 会在卸载的时候自动清除， 但是对于非 dom 的 ref 是需要手动清除 current 的
        };
    });

    const handleDisc = useCallback(
        (index?: number) => {
            if (typeof index !== 'number') {
                Logger.green('hidde Disc');
                setShowDisc(false);
            } else {
                Logger.green('show Disc');
                setShowDisc(true);
                setDisc(discList[index]);
            }
        },
        [discList]
    );

    return (
        <div className="recommend" ref={recommendContainer}>
            <div className="recommend-content" ref={scrollContanier}>
                <div>
                    <div className="slider-wrapper">
                        {!!recommends.length
                            && (
                                <Carousel>
                                    {recommends.map(item => (
                                        <div key={item.id} className="carousel-item">
                                            <a href={item.linkUrl}>
                                                <img src={item.picUrl} />
                                            </a>
                                        </div>
                                    ))}
                                </Carousel>
                            )
                        }
                    </div>
                    <div className="recommend-list" style={{paddingBottom: `${props.fullScreen ? '0' : '60px'}`}}>
                        <h1 className="list-title">热门歌单推荐</h1>
                        <ul>
                            {!!discList.length
                                && discList.map((item, index) => (
                                    <li
                                        className="item"
                                        key={item.dissid}
                                        onClick={() => {
                                            handleDisc(index);
                                        }}
                                    >
                                        <div className="icon">
                                            <LazyImage
                                                selector=".discListLazy"
                                                className="discListLazy"
                                                root={recommendContainer.current}
                                                sizes="200px"
                                                src="https://placehold.it/200x300?text=Image1"
                                                srcset={item.imgurl}
                                                width="60"
                                                height="60"
                                            />
                                        </div>
                                        <div className="text">
                                            <h2 className="name">{item.creator.name}</h2>
                                            <p className="desc">{item.dissname}</p>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
                {!discList.length && <Loading customCls="loading-container" />}
            </div>
            {/* <Route path="/recommend/:id" component={Disc}/> */}
            {showDisc && <Disc disc={disc} back={handleDisc} />}
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setDisc: (disc: IDisc) => {
            dispatch(setDisc(disc));
        }
    };
};

const mapStateToProp = (state: IStoreState) => ({
    fullScreen: state.fullScreen
});

export default withRouter(
    connect(
        mapStateToProp,
        mapDispatchToProps
    )(Recommend)
);
