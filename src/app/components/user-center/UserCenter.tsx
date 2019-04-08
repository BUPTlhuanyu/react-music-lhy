import React,{ Component } from 'react'
import './UserCenter.scss'
import NoResult from 'reuse/no-result/NoResult'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { IUserName } from 'store/stateTypes'
import LogIn from 'reuse/login/LogIn'

interface UserCenterProps{
    history:any,
    location:any,
    match:any,
    userName:IUserName
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

    render(){
        const userName = this.props.userName;
        return(
            <div className="user-center">
                <div className="back" onClick={this.back}>
                    <i className="icon-back"/>
                </div>
                {
                    !userName ?
                        <LogIn/>
                     :
                        <div className="no-result-wrapper" >
                            <NoResult title="noResultDesc"/>
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

export default withRouter(connect(mapStateToProps)(UserCenter))