import React, {Component} from 'react';
import './LogIn.scss';
import debounce from 'lodash/debounce';
import {admin} from 'api/admin.js';
import {Dispatch} from 'redux';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {setUserName} from 'actions/user';
import {IUserName, IActionCreator} from 'store/stateTypes';
import Error from 'src/app/components/error/Error';

interface LogInProps {
    setUserName: IActionCreator;
    history: any;
    location: any;
    match: any;
}

interface LogInState {
    formData: {
        userName: string;
        password: string;
        type: string;
    };
    errorText: string;
}

class LogIn extends Component<LogInProps, LogInState> {
    constructor(props: LogInProps) {
        super(props);
        this.debounceSetState = debounce(this.debounceSetState, 30, {
            leading: false
        });
        this.state = {
            formData: {
                userName: '',
                password: '',
                type: ''
            },
            errorText: ''
        };
    }

    debounceSetState = (obj: Record<string, any>) => {
        let formData = Object.assign({}, this.state.formData, obj);
        this.setState({
            formData
        });
    };

    clear = (option: string) => {
        if (option === 'userName') {
            let formData = Object.assign({}, this.state.formData, {userName: ''});
            this.setState({
                formData
            });
        } else if (option === 'password') {
            let formData = Object.assign({}, this.state.formData, {password: ''});
            this.setState({
                formData
            });
        }
    };

    userNameHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.debounceSetState({userName: e.target.value});
    };

    passwordHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.debounceSetState({password: e.target.value});
    };

    submitHandler = (type: string) => {
        let formData = Object.assign({}, this.state.formData, {type: type});
        this.setState({
            formData
        });
        admin(formData).then((res: any) => {
            if (res.success) {
                this.props.setUserName(formData.userName);
            } else {
                if (res.message) {
                    this.setState({
                        errorText: res.message
                    });
                }
            }
        });
    };

    clearError = () => {
        this.setState({
            errorText: ''
        });
    };

    render() {
        const {formData, errorText} = this.state;
        return (
            <div className="login">
                <div className="login-item">
                    <input
                        className="box"
                        placeholder={'用户名'}
                        onChange={this.userNameHandler}
                        value={formData.userName}
                    />
                    <i className="icon-dismiss" onClick={this.clear.bind(this, 'userName')} />
                </div>
                <div className="login-item">
                    <input
                        className="box"
                        placeholder={'密码'}
                        onChange={this.passwordHandler}
                        value={formData.password}
                        type="password"
                    />
                    <i className="icon-dismiss" onClick={this.clear.bind(this, 'password')} />
                </div>
                <div className="login-item">
                    <span className="box btn" onClick={this.submitHandler.bind(this, '登录')}>
                        登录
                    </span>
                </div>
                <div className="login-item">
                    <span className="box btn" onClick={this.submitHandler.bind(this, '注册')}>
                        注册
                    </span>
                </div>
                {errorText && <Error text={errorText} clearError={this.clearError} />}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => {
    return {
        setUserName: (userName: IUserName) => dispatch(setUserName(userName)),
        ...ownProps
    };
};

export default withRouter(
    connect(
        () => ({}),
        mapDispatchToProps
    )(LogIn)
);
