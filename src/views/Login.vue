<template>
  <div>
    <el-form v-loading="loading"
             element-loading-text="正在登录..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             :rules="rules"
             ref="loginForm"
             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="false"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="false"
                  placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input size="normal" type="text" v-model="loginForm.code"
                  auto-complete="false"
                  placeholder="点击图片更换验证码" style="width:250px;margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">
        <!--        <img src="https://th.bing.com/th/id/OIP.eaeOunC0HJmzAA0M9fU1LQAAAA?w=281&h=149&c=7&r=0&o=5&dpr=1.3&pid=1.7">-->
      </el-form-item>
      <el-checkbox class="loginRemember" v-model="checked">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>
<script>

export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/login/captcha',
      loading: false,
      checked: true,
      loginForm: {
        username: '超管-Admin',
        password: '123456',
        code: 'yyds'
      },
      /*校验规则*/
      rules: {
        username: [{
          required: true, message: '请输入用户名', trigger:
              'blur'
        }],
        password: [{
          required: true, message: '请输入密码', trigger:
              'blur'
        }],
        code: [{
          required: true, message: '请输入验证码', trigger:
              'blur'
        }]
      },
    }
  },
  mounted() {
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/login/captcha';
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp => {
            console.log(resp);
            if (resp.code === 0) {
              this.loading = false;
              //存储用户token
              // 清空菜单
              this.$store.commit('initRoutes', [])
              //页面跳转,获取重定向的地址
              let path = this.$route.query.redirect;
              if (path === '/' || path === undefined) {
                path = '/home';
              }
              this.$router.replace(path);
            }
          })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      })
    }
  }
}
</script>
<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
