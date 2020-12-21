import assign from 'lodash/assign';
import originJsonp from 'jsonp';

// const getFormData = params => {
//     for (let k in params) {
//         if (typeof params[k] === 'object' && params[k] !== null) {
//             params[k] = JSON.stringify(params[k])
//         }
//     }
//     return params;
// }

const urls = {
    signIn: '/auth/sign_in',
    forbidden: '/error/403',
    internalServerError: '/error/500',
    notFound: '/error/notFound'
};

// const ResponseCode = {
//     SUCCESS: 0
// };

// const DEFAULT_REFRESH_INTERVAL = 1500;
//
// function Response(code, data) {
//     this.code = code != null ? code : null;
//     this.data = data != null ? data : null;
// }

/**
 *
 * @param promise 异步请求结果的Promise对象
 * @param customHandler 自定义处理函数(response, actions) => Boolean
 * @param actions redux Action
 */
export async function handleResponse(response, customHandler) {
    // start to process response info
    let isHandled = false;
    let code = response.code;
    let rt = null;
    if (typeof customHandler === 'function') {
        isHandled = customHandler(response);
    }
    if (!isHandled) {
        // 如果尚未处理,则进入通用处理逻辑
        if (code === 0) {
            rt = response.data;
        } else if (code >= 400 && code <= 499) {
            switch (code) {
                case 401:
                    window.location.href = urls.notFound;
                    break;
                case 403:
                    window.location.href = urls.signIn;
                    break;
                case 404:
                    window.location.href = urls.notFound;
                    break;
                default:
                    window.location.href = urls.internalServerError;
                    break;
            }
        } else if ((code >= 500 && code <= 599) || code < 0) {
            // window.location.href = urls.notFound;
        }
    } else {
        rt = isHandled;
    }
    return rt;
}

export function parseQueryParams(data) {
    let queryStr = '';
    if (data) {
        queryStr += '?';
        for (let p in data) {
            if (data[p] != null) {
                queryStr += encodeURIComponent(p) + '=' + encodeURIComponent(data[p]) + '&';
            }
        }
    }
    queryStr = queryStr.slice(0, queryStr.length - 1);
    return queryStr;
}

async function commonHandler(options) {
    let data = null;
    try {
        let response = await fetch(options.url, options);
        if (response.ok) {
            data = await response.json();
        } else {
            data = await response.text();
        }
    } catch (error) {
        // message.error(error.message);
        // throw new error(error.message)
    }
    return data;
}

async function wsGet(options) {
    options.method = 'GET';
    options.credentials = 'include';
    options.mode = 'cors';
    options.headers = assign(
        {
            'Content-Type': 'application/json'
        },
        options.headers
    );
    if (options.data) {
        options.url = options.url + parseQueryParams(options.data);
    }
    return await commonHandler(options);
}

async function wsPost(options) {
    options.method = 'POST';
    options.credentials = 'include';
    options.mode = 'cors';
    options.headers = assign(
        {
            'Content-Type': 'application/json'
        },
        options.headers
    );
    if (options.data) {
        options.body = JSON.stringify(options.data);
    }
    return await commonHandler(options);
}

async function wsDelete(options) {
    options.method = 'DELETE';
    options.credentials = 'include';
    options.mode = 'cors';
    options.headers = assign(
        {
            'Content-Type': 'application/json'
        },
        options.headers
    );
    return await commonHandler(options);
}

export async function ws(method, options) {
    let result;
    method = method ? method.toUpperCase() : '';
    switch (method) {
        case 'GET':
            result = await wsGet(options);
            break;
        case 'POST':
            result = await wsPost(options);
            break;
        case 'DELETE':
            result = await wsDelete(options);
            break;
        default:
            result = null;
    }
    if (result) {
        if (options.handler) {
            result = await handleResponse(result, options.handler);
        } else {
            result = await handleResponse(result);
        }
    }
    return result;
}

export function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + parseQueryParams(data);

    return new Promise((resolve, reject) => {
        originJsonp(url, option, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(data);
            }
        });
    });
}
