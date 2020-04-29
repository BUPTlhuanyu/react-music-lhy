/**
 * Created by liaohuanyu on 2019/4/30.
 */
const axios = require('axios')
const _guid = Math.round(2147483647 * Math.random()) * (new Date).getUTCMilliseconds() % 1e10;

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
    },
    async getVkey(ctx) {
        const commonParams = {
            g_tk: 1124214810,
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            // format: 'json',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0,
          }
        const songmid = ctx.query.songmid + '';
        const guid = _guid ? _guid + '' : '1429839143';
        const data = {
          req: {
            module: "CDN.SrfCdnDispatchServer",
            method: "GetCdnDispatch",
            param: {
              guid,
              calltype: 0,
              userip: ""
            }
          },
          req_0: {
            module: "vkey.GetVkeyServer",
            method: "CgiGetVkey",
            param: {
              guid,
              songmid: [songmid],
              songtype: [0],
              uin: "0",
              loginflag: 1,
              platform: "20"
            }
          },
          comm: {
            uin: 0,
            format: "json",
            ct: 24,
            cv: 0
          }
        }
        const params = Object.assign({
          format: 'json',
          data: JSON.stringify(data),
        });
        let opts = Object.assign({params}, commonParams, {
            headers: {
              referer: 'https://y.qq.com/portal/player.html',
              host: 'u.y.qq.com',
              'content-type': 'application/x-www-form-urlencoded',
            },
          });
        if (songmid) {
          await axios.get('https://u.y.qq.com/cgi-bin/musicu.fcg', opts).then((res) => {
            const response = res.data;
            let playLists = [];
            const req_0 = response.req_0.data;
            req_0.sip.map(sipURL => {
              const purl = req_0.midurlinfo[0].purl;
              const URI = `${sipURL}${purl}`
              playLists.push(URI);
            });
            response.playLists = playLists;
            ctx.body = {
              response,
            }
          }).catch(error => {
            console.log(`error`, error);
          });
        } else {
          ctx.status = 400;
          ctx.body = {
            response: 'no songmid',
          }
        }
      }
}