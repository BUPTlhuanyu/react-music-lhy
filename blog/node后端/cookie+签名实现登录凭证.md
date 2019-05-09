#### 签名工具函数
SECREAT这里是模拟的私钥
```
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
```

#### 登录接口设置cookie

在用户登录的时候，通过set-cookie种下cookie，cid表示用户id，signature表示利用私钥对cid进行的签名。
```
async signIn( ctx ){
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null,
      code: ''
    }
    let userResult = await userInfoService.signIn( formData )
    if ( userResult ) {
      if ( formData.userName === userResult.user_name ) {
          ctx.cookies.set(
              'cid',
              userResult.user_id,
              ckConfig
          );
          ctx.cookies.set(
              'signature',
              getSignature(userResult.user_id),
              ckConfig
          )
        result.success = true
      } else {
        result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR
        result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR'
      }
    } else {
      result.code = 'FAIL_USER_NO_EXIST',
      result.message = userCode.FAIL_USER_NO_EXIST
    }
    ctx.body = result;
  }
```

#### 获取数据的时候验证cookie中的签名
在用户请求获取用户信息的时候，前端自动带上cookie，然后后端在接收到这两个cookie值的时候，利用签名函数对cid进行签名，将得到的签名与cookie中signature进行对比，如果相等则返回用户数据，如果不相等则说明有篡改，返回错误信息。


```
async getUserInfo( ctx ){
      let result = {
          success: false,
          message: '',
          data: null,
          code: ''
      }
      let cid = ctx.cookies.get('cid')
      let signature = ctx.cookies.get('signature')
      if(verificationSignature(cid, signature)){
          let userResult = await userInfoService.getUserInfoByUserId(cid)
          if(userResult){
              result.success = true
              result.data = {
                  userName : userResult.userName
              }
          }else{
              result.message = userCode.FAIL_USER_NO_EXIST
          }
      }else{
          result.message = userCode.BAD_REQUEST
      }
      ctx.body = result
  }
```




