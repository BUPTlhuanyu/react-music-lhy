import React,{ Component } from 'react'
import './Error.scss'

interface ErrorProps{
    text:string,
    clearError:Function
}

const Error : React.SFC<ErrorProps> = (props) => (
    <div className="error">
        <div className="error-wrapper">
            <div className="error-content">
                <p className="text">{props.text}</p>
                <span className="icon" onClick={()=>{props.clearError()}}>
                        <i className="icon-delete"/>
                </span>
            </div>
        </div>
    </div>
)

export default Error