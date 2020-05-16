/**
 * @Description: 使用组件Scroll的时候，可以当做正常标签使用，className依然表示class
 *                  scrollHandler获取滑动位置
 * @author: liaohuanyu
 * @date 2019/2/1
*/
import BScroll, { BsOption, Position } from 'better-scroll'

function initScroller(ref: Element, options: Partial<BsOption>): BScroll{
    const {
        probeType = 2,
        click
    } = options
    let wrapperBs = new BScroll(ref, {
        probeType,
        click
    })
    return wrapperBs
}

export default initScroller