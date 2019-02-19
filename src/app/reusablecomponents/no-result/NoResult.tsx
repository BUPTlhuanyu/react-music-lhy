import React from 'react'
import './NoResult.scss'

interface NoResultProps{
    title?:string
}

const NoResult : React.SFC<NoResultProps> = ({title = ''}) => {
    return (
        <div className="no-result">
            <div className="no-result-icon"></div>
            <p className="no-result-text">{title}</p>
        </div>
    )
}

export default NoResult
