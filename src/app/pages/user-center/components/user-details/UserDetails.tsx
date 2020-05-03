/**
 * @author: liaohuanyu
 * @date 2019/2/19
*/

import React, {Component} from 'react'
import './UserDetails.scss'
import NoResult from 'src/app/components/no-result/NoResult'
import {getUserInfo} from 'api/admin.js'
import {getDataByPage} from 'api/favorite.js'
import Loading from 'src/app/components/loading/Loading';
import Scroll from 'src/app/components/scroll/Scroll'
import logo from "./logo@3x.png"

interface UserDetailsProps{

}

interface UserDetailsState{
    avatar? : string,
    userName? : string,
    loading : boolean,
    favoriteSongs?: Array<any>
}

class UserDetails extends Component<UserDetailsProps, UserDetailsState>{
    constructor(props:UserDetailsProps){
        super(props)
        this.state = {
            loading : false
        }
    }
    componentDidMount(){
        getUserInfo().then((res) => {
            let userName = res.data && res.data.userName;
            if(userName){
                getDataByPage({userName}).then((res)=>{
                    console.log(res)
                    this.setState({
                        loading : true,
                        userName,
                        favoriteSongs : res.data
                    })
                })
            }
        });
    }
    render(){
        let {
                userName,
                loading,
                favoriteSongs,
                avatar
            } = this.state;
        return (
            <div className = "user-details">
                {
                    !loading ?
                    <Loading text={"正在获取数据"}/>
                        :
                        userName || favoriteSongs ?
                            <div>
                                <div className="user-info">
                                    <img
                                        alt="user"
                                        className="avatar"
                                        src={avatar?avatar:logo}
                                        width="100"
                                        height="100"
                                    />
                                    <span className="name">{userName}</span>
                                </div>
                                <Scroll className="list-content" >
                                    <ul >
                                        {
                                            favoriteSongs && favoriteSongs.map((item, index)=>(
                                                <li
                                                    className="item"
                                                    key={index}
                                                >
                                                    <i className={"current "} />
                                                    <span className="text">{item.name}</span>
                                                    <span className="like" >
                                                        <i className="icon-not-favorite"/>
                                                    </span>
                                                    <span className="delete">
                                                        <i className="icon-delete"/>
                                                    </span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </Scroll>
                            </div>
                            :
                            <NoResult title="noResultDesc"/>
                }
            </div>
        )
    }
}

export default UserDetails
