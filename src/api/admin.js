/**
 * Created by liaohuanyu on 2019/4/8.
 */
import {host} from './config'
import axios from 'axios'

export function admin(options) {
    let url;
    if(options.type === '登录'){
        url = host + '/api/login'
    }else if(options.type === '注册'){
        url = host + '/api/logup'
    }
    const data = Object.assign({}, {userName:'',passWord:''}, options)

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}
