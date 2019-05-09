/**
 * Created by liaohuanyu on 2019/5/9.
 */
const crypto = require("crypto")
const SECREAT = "SHAs8&D#dksd1547ff1@dd5df1f5ygh"

function getSignature(userId){
    const hmac = crypto.createHmac('SHA256',SECREAT);
    hmac.update(userId + '');
    return hmac.digest('hex')
}

function verificationSignature(cid , signature){
    return signature === getSignature(cid)
}

module.exports = {
    getSignature,
    verificationSignature
}
