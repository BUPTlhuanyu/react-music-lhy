import React,{ Component } from 'react'
import './LogIn.scss'

interface LogInProps{

}

interface LogInState{

}


class LogIn extends Component<LogInProps,LogInState>{
    constructor(props:LogInProps){
        super(props);
        this.state={

        }
    }

    render(){
        return(
            <div className="login">
                <div className="login-item">
                    <input className="box"
                           placeholder={"用户名"}
                    />
                    <i  className="icon-dismiss"
                    />
                </div>
                <div className="login-item">
                    <input className="box"
                           placeholder={"密码"}
                    />
                    <i  className="icon-dismiss"
                    />
                </div>
                <div className="login-item">
                    <input className="box" type="submit" value="登录"/>
                </div>
                <div className="login-item">
                    <input className="box" type="submit" value="注册"/>
                </div>
            </div>

        )
    }
}

export default LogIn