import {commonParams} from './config';
import {ws} from 'common/js/ws';

export function getLyric(mid) {
    const url = '/api/lyric';

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    });
    const options = {
        url,
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        data
    };
    return ws('GET', options);
}
