import React, { useEffect,useRef } from 'react'

function useMounted(){
    const mountedRef: React.MutableRefObject<boolean> = useRef(false)
    useEffect(() => {
        mountedRef.current = true
    }, [])
    return mountedRef.current
}

export default useMounted