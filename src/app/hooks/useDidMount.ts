import React, { useEffect } from 'react'

function useDidMount(fn: React.EffectCallback){
    if(typeof fn !== 'function'){
        throw new Error('请传入一个函数作为didMount的执行函数')
    }
    return useEffect(fn, [])
}

export default useDidMount