<template>
  <div class="loginContainer">
    <div class="loginBox">
      <h2 class="login">Login</h2>
      <!-- 登陆表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登陆表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //  表单验证
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, messages: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, messages: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮
    resetLoginForm () {
      //   console.log(this);
      // element Form Methods---resetFields
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // Element Form Methods validate属性
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // alert('登录成功')
        if (res.meta.status !== 200) return this.$Message.error('登录失败')
        else {
          this.$Message.success('登录成功')
          // 登陆成功后生成 token,并保存到客户端的 sessionStorage中
          // localStorage 是持久化的保存机制 sessionStorage是在网站打开期间生效
          window.sessionStorage.setItem('token', res.data.token)
          // 编程导航this.$router.push('/路径')
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style lang="less">
.loginContainer {
  background: linear-gradient(#141e30, #243b55);
  height: 100%;
  width: 100%;
}
.loginBox {
  width: 400px;
  height: 370px;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 15px 25px 0 rgba(0, 0, 0, 0.6);
  padding: 40px;
  box-sizing: border-box;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login {
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
  font-size: 27px;
  font-family: "微软雅黑";
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
