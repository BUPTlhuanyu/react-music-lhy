import React, { useEffect } from 'react'

/**
 * 用于模拟didMount以及willUnmount生命周期
 * @param fn 一个effect的执行函数，在挂载的时候调用fn，并在卸载的时候执行fn返回的函数，如果fn不返回值则卸载的时候啥也不做
 */
function useDidMountAndWillUnmount(fn: React.EffectCallback){
    if(typeof fn !== 'function'){
        throw new Error('请传入一个函数作为didMount的执行函数')
    }
    return useEffect(fn, [])
}

export default useDidMountAndWillUnmount