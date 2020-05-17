import BScroll, {BsOption} from 'better-scroll'
// import {addClass} from 'common/js/dom.js'

export default class Carouseler{
    carousel: HTMLElement
    carouselGroup: HTMLElement
    carouselBS: BScroll | null
    timer: NodeJS.Timeout | null
    resizeTimer: NodeJS.Timeout | null
    onScrollEndFn: Function
    // carouselItemClass: string
    BSoptions?: Partial<BsOption>
    constructor(carousel: HTMLElement, carouselGroup: HTMLElement, onScrollEndFn: Function, BSoptions?: Partial<BsOption>){
      if(!carousel && !carouselGroup){
        throw new Error('carousel and carouselGroup must be type of HTMLElement')
      }
      this.carousel = carousel
      this.carouselGroup = carouselGroup
      this.onScrollEndFn = onScrollEndFn
      // this.carouselItemClass = carouselItemClass
      this.BSoptions = BSoptions
      this.carouselBS = null
      this.timer = null
      this.resizeTimer = null

      this.cleanUp = this.cleanUp.bind(this)
      this.refresh = this.refresh.bind(this)
      this.play = this.play.bind(this)
      this._onScrollEnd = this._onScrollEnd.bind(this)
    }
    init(){
      this._setSlideWidth() 
      // this._initSlide()
      if(this.BSoptions && typeof this.BSoptions.snap === 'object' && this.BSoptions.snap.loop){
        // this.play()
      }
      // this._onResize()
    }
    /* 用于设置轮播图每个图片宽以及所有轮播图的宽度 */
    _setSlideWidth(isResize:boolean=false){
      if(!this.carousel || !this.carouselGroup) return
      let carouselGroupChildren = this.carouselGroup.children
      let width = 0
      let sliderWidth = this.carousel.clientWidth
      for (let i = 0; i < carouselGroupChildren.length; i++) {
          let child = carouselGroupChildren[i]
          // addClass(child, this.carouselItemClass);
          child.setAttribute('style', `width: ${sliderWidth}px`)
          // (child as HTMLElement).style.width = sliderWidth + 'px' // 或者
          width += sliderWidth
      }
      if (this.BSoptions && typeof this.BSoptions.snap === 'object' && this.BSoptions.snap.loop && !isResize) {
          width += 2 * sliderWidth
      }
      this.carouselGroup.style.width = width + 'px'
    }
    /* 初始化 better-scroll*/
    _initSlide(){
      if(!this.carousel)return
      this.carouselBS = new BScroll(this.carousel, this.BSoptions)
      this.carouselBS.on('scrollEnd', this._onScrollEnd)
      this.carouselBS.on('touchEnd', this.play)
      this.carouselBS.on('beforeScrollStart', () => {
        if(this.timer)clearTimeout(this.timer)
      })
    }
    _onScrollEnd(){
      let pageIndex = this.carouselBS ? this.carouselBS.getCurrentPage().pageX : 0;
      this.onScrollEndFn(pageIndex)
      this.play()
    }
    play(){
      if(this.timer)clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.carouselBS && this.carouselBS.next()
      }, 4000)
    }
    refresh(){
      this._setSlideWidth(true)
      this.carouselBS && this.carouselBS.refresh()
    }
    cleanUp(){
      this.timer && clearTimeout(this.timer)
      this.resizeTimer && clearTimeout(this.resizeTimer)
      window.removeEventListener('resize', this._resizeHandler)
      this.carouselBS && this.carouselBS.destroy()
    }
    _resizeHandler(){
        if (!this.carouselBS || !this.carouselBS.enabled) {
            return
        }
        this.resizeTimer && clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
            if (this.carouselBS && this.carouselBS.isInTransition) {
                this._onScrollEnd()
            } else {
              this.play()
            }
            this.refresh()
        }, 60)
    }
    _onResize(){
      window.addEventListener('resize', this._resizeHandler)  
    }
}