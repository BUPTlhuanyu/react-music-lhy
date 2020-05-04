import React, {Component} from 'react'
import './Header.scss'
import { Link } from 'react-router-dom'

function Header(){
    return (
        <div className="m-header">
            <div className="icon"></div>
            <h1 className="text">React Music</h1>
            <Link className="mine" to="/user">
                <i className="icon-mine"/>
            </Link>
        </div>
    )
}

export default Header