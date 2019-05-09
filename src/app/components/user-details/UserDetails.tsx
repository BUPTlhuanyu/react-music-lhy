/**
 * @author: liaohuanyu
 * @date 2019/2/19
*/

import React, {Component} from 'react'
import './UserDetails.scss'
import NoResult from 'reuse/no-result/NoResult'
import {getUserInfo} from 'api/admin.js'
import {getDataByPage} from 'api/favorite.js'
import Loading from 'reuse/loading/Loading';

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
                favoriteSongs

            } = this.state;
        return (
            <div>
                {
                    !loading ?
                    <Loading text={"正在获取数据"}/>
                        :
                        userName || favoriteSongs ?
                            <div>
                                {userName}
                                {
                                    favoriteSongs && favoriteSongs.map((item , index)=> {
                                        return (
                                                <div key = {item.mid}>
                                                    {item.name}
                                                </div>
                                            )
                                    })
                                }
                            </div>
                            :
                            <NoResult title="noResultDesc"/>
                }
            </div>
        )
    }
}

export default UserDetails
