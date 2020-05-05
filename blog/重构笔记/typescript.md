#### 操作原生dom

```
  const _setSlideWidth = useCallback((isResize:boolean=false) => {
    let carouselGroupChildren = carouselGroup.current.children
    let width = 0
    let sliderWidth = carousel.current.clientWidth
    for (let i = 0; i < carouselGroupChildren.length; i++) {
        let child = carouselGroupChildren[i]
        addClass(child, 'carousel-item')
        child.setAttribute('style', `width: ${sliderWidth}px`)
        width += sliderWidth
    }
    if (BSoptions.loop && !isResize) {
        width += 2 * sliderWidth
    }
    carouselGroup.current.style.width = width + 'px'
  }, [carousel, carouselGroup])
```
原生DOM节点的  `children`属性是`carouselGroupChildren`类型是`HTMLColection`, 而`carouselGroupChildren[i]`类型是`Element`， 类型`Element`上没有定义`style`，所以可以用`setAttribute`来修改`style`。或者利用断言来做：
```
(child as HTMLElement).style.width = sliderWidth + 'px'
```

参考：[2339 Property 'style' does not exist on type 'Element'.](https://github.com/Microsoft/TypeScript/issues/3263)

#### useRef返回的类型
如果ref用于引用组件的实例(ref挂在组件上)或者原生dom(ref挂在JSX的div这样的HostComponent上)。那么这样的ref.current是不可变的：

```
JSX：
<div className="carousel" ref={carousel}></div>

JS:
const carousel: React.RefObject<HTMLDivElement> = useRef(null)
```

如果ref用于保存组件中的变量，则用`MutableRefObject`

```
const unmoutedFlag: React.MutableRefObject<boolean> = useRef(false) 
```


