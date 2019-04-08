import React,{ Component } from 'react'
import './LogIn.scss'
import debounce from 'lodash/debounce'
import {admin} from 'api/admin.js'
import {ERR_OK} from 'api/config'

interface LogInProps{

}

interface LogInState{
    formData : {
        userName : string,
        passWord : string,
        type : string
    }
}


class LogIn extends Component<LogInProps,LogInState>{
    constructor(props:LogInProps){
        super(props);
        this.debounceSetState = debounce(this.debounceSetState, 100, {
            leading: false,
        });
        this.state={
            formData : {
                userName : '',
                passWord : '',
                type : ''
            }
        }
    }

    debounceSetState = (obj:object)=> {
        let formData = Object.assign({},this.state.formData,obj)
        this.setState({
            formData
        })
    }

    clear = (option:string) => {
        if(option === 'userName' ){
            let formData = Object.assign({},this.state.formData,{userName:''})
            this.setState({
                formData
            })
        }else if(option === 'passWord' ){
            let formData = Object.assign({},this.state.formData,{passWord:''})
            this.setState({
                formData
            })
        }
    }

    userNameHandler : React.ChangeEventHandler<HTMLInputElement>= (e) => {
        this.debounceSetState({userName:e.target.value})
    }

    passWordHandler : React.ChangeEventHandler<HTMLInputElement>= (e) => {
        this.debounceSetState({passWord:e.target.value})
    }

    submitHandler = (type:string) => {
        let formData = Object.assign({},this.state.formData,{type:type})
        console.log(formData)
        this.setState({
            formData
        })
        admin(formData).then((res:any) => {
            if (res.code === ERR_OK) {
                console.log(res)
            }
        })
    }


    render(){
        const formData = this.state.formData;
        return(
            <div className="login">
                <div className="login-item">
                    <input className="box"
                           placeholder={"用户名"}
                           onChange={this.userNameHandler}
                           value = {formData.userName}
                    />
                    <i  className="icon-dismiss"
                        onClick={ this.clear.bind(this,'userName') }
                    />
                </div>
                <div className="login-item">
                    <input className="box"
                           placeholder={"密码"}
                           onChange={this.passWordHandler}
                           value = {formData.passWord}
                    />
                    <i  className="icon-dismiss"
                        onClick={ this.clear.bind(this,'passWord') }
                    />
                </div>
                <div className="login-item">
                    <span className="box btn"
                           onClick={this.submitHandler.bind(this,'登录')}
                    >登录</span>
                </div>
                <div className="login-item">
                    <span className="box btn"
                            onClick={this.submitHandler.bind(this,'注册')}
                    >注册</span>
                </div>
            </div>

        )
    }
}

export default LogIn