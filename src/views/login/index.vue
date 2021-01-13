<template>
  <div class="login-container">
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form"
             auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">客户资源查询平台</h3>
      </div>

<!--      <el-form-item prop="username">-->
<!--        <span class="svg-container">-->
<!--          <svg-icon icon-class="user" />-->
<!--        </span>-->
<!--        <el-input ref="username"-->
<!--                  v-model="loginForm.username"-->
<!--                  placeholder="Username"-->
<!--                  name="username"-->
<!--                  type="text"-->
<!--                  tabindex="1"-->
<!--                  auto-complete="on" />-->
<!--      </el-form-item>-->

      <el-form-item prop="phone">
        <span class="svg-container" style="font-size: 18px;">
          <svg-icon icon-class="phone"/>
        </span>
        <el-input ref="phone"
                  v-model.trim="loginForm.phone"
                  placeholder="手机号码"
                  name="phone"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                  maxlength="11"
        />
      </el-form-item>

      <!--<el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin" />
        <span class="show-pwd"
              @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>-->
      <el-form-item prop="testCode" style="display: inline-block; width: 300px;">
        <span class="svg-container" style="font-size: 18px;">
          <svg-icon icon-class="password"/>
        </span>
      <el-input ref="testCode"
                v-model.trim="loginForm.testCode"
                placeholder="验证码"
                name="testCode"
                type="text"
                tabindex="2"
                auto-complete="on"
                maxLenghth="6"
      />
      </el-form-item>

      <el-button :type="testText === '获取验证码' ? 'primary' : 'info'" class="test-code" @click="sendCode">{{testText}}</el-button>

      <el-button :loading="loading"
                 type="primary"
                 style="width: 100%; margin-bottom: 30px;"
                 @click.native.prevent="handleLogin">登录</el-button>

<!--      <div class="tips">-->
<!--        <span style="margin-right: 20px;">username: admin</span>-->
<!--        <span> password: any</span>-->
<!--      </div>-->

    </el-form>
  </div>
</template>

<script>
import { validPhoneNumber } from '@/utils/validate'
import { loginCode, loginFn } from '../../api/user'
import { setToken1, setToken } from '../../utils/auth'

export default {
  name: 'Login',
  data () {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePhoneNumber = (rule, value, callback) => {
      if (!validPhoneNumber(value)) {
        callback(new Error('请输入正确手机号码'))
      } else {
        callback()
      }
    }
    const validateTestCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码必须是6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        phone: '',
        testCode: ''
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        testCode: [{ required: true, trigger: 'blur', validator: validateTestCode }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      testText: '获取验证码',
      intervalIndex: null // 定时器下标
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    loginForm: {
      handler: function (val) {
        this.loginForm.phone = val.phone.replace(/[^\d]/g, '')
        this.loginForm.testCode = val.testCode.replace(/[^\d]/g, '')
      },
      deep: true// 对象内部的属性监听，也叫深度监听
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((response) => {
              const params = {
                phone: this.loginForm.phone,
                code: this.loginForm.testCode
              }
              loginFn(params).then(res => {
              // console.log(res)
                if (res.token) {
                  const { data } = response
                  this.$store.commit('user/SET_TOKEN', data.token)
                  setToken(data.token)
                  const roleObj = res
                  delete roleObj.headers
                  this.$store.commit('user/SET_ROLEObj', roleObj)
                  setToken1(res.token)
                  this.$router.push({ path: this.redirect || '/' })
                  // 保存roleObj，防止刷新页面vuex数据丢失
                  sessionStorage.setItem('roleObj', JSON.stringify(roleObj))
                  window.sessionStorage.role = res.role
                } else {
                  this.$store.dispatch('/user/logout')
                }
              })
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 发送二维码
    sendCode () {
      if (!validPhoneNumber(this.loginForm.phone)) {
        this.$message.warning('请输入手机号码')
        return
      }
      if (this.testText !== '获取验证码') return
      if (this.testText === '获取验证码') {
        loginCode({
          phone: this.loginForm.phone
        }).then(res => {
          if (res.indexOf('发送成功验证码') > -1) { // 开发环境和测试环境
            alert(res)
          } else {
            this.$message.success(res)
          }
          let number = 60
          this.intervalIndex = setInterval(() => {
            this.testText = `剩余${number}秒`
            number--
            if (number < 0) {
              clearInterval(this.intervalIndex)
              this.testText = '获取验证码'
            }
          }, 1000)
        })
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;
    height: 47px;

    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      background: transparent;
      border: 0;
      border-radius: 0;
      -webkit-appearance: none;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    color: #454545;
    background: rgba(0, 0, 0, .1);
    border: 1px solid rgba(255, 255, 255, .1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: $bg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .test-code {
      float: right;
      height: 52px;
    }
  }

  .tips {
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    display: inline-block;
    width: 30px;
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px;
      font-size: 26px;
      font-weight: bold;
      color: $light_gray;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    top: 7px;
    right: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
