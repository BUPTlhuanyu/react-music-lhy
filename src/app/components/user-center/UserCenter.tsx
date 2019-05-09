import React,{ Component } from 'react'
import './UserCenter.scss'
import UserDetails from '../user-details/UserDetails'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { IUserName } from 'store/stateTypes'
import LogIn from 'reuse/login/LogIn'
import {
    setUserName,
} from 'actions/user'
import { Dispatch } from 'redux'

interface UserCenterProps{
    history:any,
    location:any,
    match:any,
    userName:IUserName,
    setUserName:Function
}

interface UserCenterState{

}



class UserCenter extends Component<UserCenterProps,UserCenterState>{
    constructor(props:UserCenterProps){
        super(props);
        this.state={

        }
    }

    back = () => {
        this.props.history.goBack();
    }

    logout = () => {
        if(this.props.userName){
            this.props.setUserName('')
        }
    }

    render(){
        const userName = this.props.userName;
        return(
            <div className="user-center">
                <div className="back" onClick={this.back}>
                    <i className="icon-back"/>
                </div>
                <div className="logout" onClick={this.logout}>
                    <span>logout</span>
                </div>
                {
                    !userName ?
                        <LogIn/>
                     :
                        <div className="user-details-wrapper" >
                            <UserDetails />
                        </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state : {userName : IUserName}, ownProps : any) => (
    {
        userName : state.userName,
        ...ownProps
    }
)
const mapDispatchToProps = (dispatch:Dispatch,ownProps:any) => {
    return {
        setUserName: (userName:IUserName) => (
            dispatch(setUserName(userName))
        ),
        ...ownProps
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserCenter))