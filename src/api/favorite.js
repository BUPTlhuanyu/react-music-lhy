/**
 * Created by liaohuanyu on 2019/4/28.
 */
import axios from 'axios';

export function addFavorite(options) {
    let url;
    url = '/favorite/add';
    const data = Object.assign(
        {},
        {
            userName: '',
            mid: '',
            singer: '',
            name: '',
            album: '',
            duration: 0,
            image: '',
            url: ''
        },
        options
    );

    return axios.post(url, data, {withCredentials: true}).then(res => {
        return Promise.resolve(res.data);
    });
}

export function deleteFavorite(options) {
    let url;
    url = '/favorite/delete';
    const data = Object.assign(
        {},
        {
            userName: '',
            mid: '',
            singer: '',
            name: '',
            album: '',
            duration: 0,
            image: '',
            url: ''
        },
        options
    );

    return axios.post(url, data).then(res => {
        return Promise.resolve(res.data);
    });
}

export function getDataByPage(options) {
    let url;
    url = '/favorite/getFavorite';
    const data = Object.assign(
        {},
        {
            userName: ''
        },
        options
    );

    return axios.post(url, data).then(res => {
        return Promise.resolve(res.data);
    });
}
