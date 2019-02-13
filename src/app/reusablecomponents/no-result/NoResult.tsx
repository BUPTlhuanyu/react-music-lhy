import React from 'react'
import './NoResult.scss'

export default function NoResult(props:any){
    return (
        <div className="no-result">
            <div className="no-result-icon"></div>
            <p className="no-result-text">{props.title || ''}</p>
        </div>
    )
}

