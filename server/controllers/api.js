/**
 * Created by liaohuanyu on 2019/4/30.
 */
const axios = require('axios')

module.exports = {
    async getDiscList (ctx) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        await axios.get(url, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com'
            },
            params: ctx.query
        }).then((response) => {
            ctx.body = response.data
        }).catch((e) => {
            console.log(e)
        })
    },
    async search (ctx) {
        var url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        await axios.get(url, {
            headers: {
                referer: 'https://y.qq.com/portal/search.html',
                host: 'c.y.qq.com'
            },
            params: ctx.query
        }).then((response) => {
            ctx.body = response.data
        }).catch((e) => {
            console.log(e)
        })
    },
    async getSongList (ctx) {
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        await axios.get(url, {
            headers: {
                referer: 'https://y.qq.com/n/yqq/playsquare/6225968420.html',
                host: 'c.y.qq.com'
            },
            params: ctx.query
        }).then((response) => {
            ctx.body = response.data
        }).catch((e) => {
            console.log(e)
        })
    },
    async lyric (ctx) {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        await axios.get(url, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com'
            },
            params: ctx.query
        }).then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
                var reg = /^\w+\(({[^()]+})\)$/
                var matches = ret.match(reg)
                if (matches) {
                    ret = JSON.parse(matches[1])
                }
            }
            ctx.body = ret
        }).catch((e) => {
            console.log(e)
        })
    }
}