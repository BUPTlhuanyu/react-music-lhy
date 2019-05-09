const userInfoService = require('./../services/user-info')
const userCode = require('./../codes/user')
const { getSignature, verificationSignature } = require('./../utils/crypto')

//cookie版本0：不设置expire表示会话结束就关闭标签需要重新登录，expire表示到期时间
//cookie版本1：maxage表示从设置cookie开始存在的秒数
const ckConfig = {
    domain:'localhost',
    path:'/',
    // maxAge: 10 * 60 * 1000,
    // 单位是ms
    maxAge: 10000,
    //当前时间一分钟过期：60000ms
    expires: new Date(Date.now()+600000),
    httpOnly:false,
    overwrite:true
}

module.exports = {
  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
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
  },

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
  },

  async signUp( ctx ){
      let formData = ctx.request.body;
      let result = {
          success: false,
          message: '',
          data: null,
          code: ''
      }
      let validateResult = await userInfoService.validatorSignUp( formData )
      if ( validateResult.success === false ) {
        result = validateResult
        ctx.body = result
        return
      }

      let existOne  = await userInfoService.getExistOne(formData)
      if ( existOne  ) {
        if ( existOne.user_name === formData.userName ) {
          result.message = userCode.FAIL_USER_NAME_IS_EXIST
          ctx.body = result
          return
        }
      }
      let userResult = await userInfoService.create({
          user_password: formData.password,
          user_name: formData.userName
      })
      if ( userResult && userResult.insertId * 1 > 0) {
          console.log(userResult)
          ctx.cookies.set(
              'cid',
              userResult.insertId,
              ckConfig
          );
          ctx.cookies.set(
              'signature',
              getSignature(userResult.insertId),
              ckConfig
          )
          result.success = true
      } else {
          result.message = userCode.ERROR_SYS
      }
      ctx.body = result
  }
}





// module.exports = {
//
//   /**
//    * 登录操作
//    * @param  {obejct} ctx 上下文对象
//    */
//   async signIn( ctx ) {
//     let formData = ctx.request.body
//     let result = {
//       success: false,
//       message: '',
//       data: null,
//       code: ''
//     }
//
//     let userResult = await userInfoService.signIn( formData )
//
//     if ( userResult ) {
//       if ( formData.userName === userResult.name ) {
//         result.success = true
//       } else {
//         result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR
//         result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR'
//       }
//     } else {
//       result.code = 'FAIL_USER_NO_EXIST',
//       result.message = userCode.FAIL_USER_NO_EXIST
//     }
//
//     if ( formData.source === 'form' || result.success === true ) {
//       let session = ctx.session
//       session.isLogin = true
//       session.userName = userResult.name
//       session.userId = userResult.id
//       ctx.body = result
//         console.log("success")
//     } else {
//       ctx.body = result
//     }
//   },
//
//   /**
//    * 注册操作
//    * @param   {obejct} ctx 上下文对象
//    */
//   async signUp( ctx ) {
//     let formData = ctx.request.body
//     let result = {
//       success: false,
//       message: '',
//       data: null
//     }
//
//     let validateResult = userInfoService.validatorSignUp( formData )
//
//     if ( validateResult.success === false ) {
//       result = validateResult
//       ctx.body = result
//       return
//     }
//
//     let existOne  = await userInfoService.getExistOne(formData)
//     console.log( existOne )
//
//     if ( existOne  ) {
//       if ( existOne .name === formData.userName ) {
//         result.message = userCode.FAIL_USER_NAME_IS_EXIST
//         ctx.body = result
//         return
//       }
//       if ( existOne .email === formData.email ) {
//         result.message = userCode.FAIL_EMAIL_IS_EXIST
//         ctx.body = result
//         return
//       }
//     }
//
//
//     let userResult = await userInfoService.create({
//       email: formData.email,
//       password: formData.password,
//       name: formData.userName,
//       create_time: new Date().getTime(),
//       level: 1,
//     })
//
//     console.log( userResult )
//
//     if ( userResult && userResult.insertId * 1 > 0) {
//       result.success = true
//     } else {
//       result.message = userCode.ERROR_SYS
//     }
//
//     ctx.body = result
//   },
//
//   /**
//    * 获取用户信息
//    * @param    {obejct} ctx 上下文对象
//    */
//   async getLoginUserInfo( ctx ) {
//     let session = ctx.session
//     let isLogin = session.isLogin
//     let userName = session.userName
//
//     console.log( 'session=', session )
//
//     let result = {
//       success: false,
//       message: '',
//       data: null,
//     }
//     if ( isLogin === true && userName ) {
//       let userInfo = await userInfoService.getUserInfoByUserName( userName )
//       if ( userInfo ) {
//         result.data = userInfo
//         result.success = true
//       } else {
//         result.message = userCode.FAIL_USER_NO_LOGIN
//       }
//     } else {
//       // TODO
//     }
//
//     ctx.body = result
//   },
//
//   /**
//    * 校验用户是否登录
//    * @param  {obejct} ctx 上下文对象
//    */
//   validateLogin( ctx ) {
//     let result = {
//       success: false,
//       message: userCode.FAIL_USER_NO_LOGIN,
//       data: null,
//       code: 'FAIL_USER_NO_LOGIN',
//     }
//     let session = ctx.session
//     if( session && session.isLogin === true  ) {
//       result.success = true
//       result.message = ''
//       result.code = ''
//     }
//     return result
//   }
//
//
// }
