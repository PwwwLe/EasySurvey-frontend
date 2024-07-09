<script setup>

import { computed, reactive, ref } from "vue";
import { ChatDotSquare, Lock, Message, User } from "@element-plus/icons-vue";
import { login, get, post, Register } from "@/net";
import { ElMessage } from "element-plus";
import router from "@/router";

//登录方面
const loginForm = reactive({
  username: '',
  password: '',
  role: '0',
})

const loginRule = {
  username: [
    { required: true, message: '请输入用户名' }
  ],
  password: [
    { required: true, message: '请输入密码' }
  ],
  role: [
    { required: true, message: '请输入role' }
  ]
}

const loginFormRef = ref()

function userLogin () {
  loginFormRef.value.validate((isValid) => {
    if (isValid) {
      login(loginForm.username, loginForm.password, loginForm.role, () => { router.push('/index') })
    }
  });
  //直接跳到主页，调试用
  //router.push('/index')
}

const isActive = ref(false);

const switchToLogin = () => {
  isActive.value = false;
};

const switchToRegister = () => {
  isActive.value = true;
};

//注册方面
const registerForm = reactive({
  username: '',
  password: '',
  password_repeat: ''
})

const registerFormRef = ref()

const validateUsername = (registerRule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
    console.warn(`请输入用户名`)
  } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error('用户名不能包含特殊字符,只能是中/英文'))
    console.warn(`用户名不能包含特殊字符,只能是中/英文`)
  } else {
    callback()
  }
}

const validatePassword = (registerRule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
    console.warn(`请再次输入密码`)
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致"))
    console.warn(`两次输入的密码不一致${value},${registerForm.password}`)
  } else {
    callback()
  }
}

const registerRule = {
  username: [
    { validator: validateUsername, trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码的长度必须在6-16个字符之间', trigger: ['blur', 'change'] }
  ],
  password_repeat: [
    { validator: validatePassword, trigger: ['blur', 'change'] },
  ]
}

const register = () => {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      console.log(`注册表单有效`);
      // post('/register', {
      //     name: registerForm.username,
      //     password: registerForm.password,
      // }, () => {
      //     ElMessage.success('注册成功，欢迎加入我们')
      //     console.warn(`注册成功，欢迎加入我们`)
      //     router.push("/")
      // })
      Register(registerForm.username, registerForm.password, () => { router.push("/") })
    } else {
      ElMessage.warning('请完整填写注册表单内容')
      console.warn(`请完整填写注册表单内容`)
    }
  })
}
</script>

<template>
  <div class="page-center">
    <div class="container"
         :class="{ active: isActive }">
      <div class="form-container sign-up">
        <form>
          <h1 style="margin-bottom: 20px;">创建用户账号</h1>
          <span style="margin-bottom: 20px;">注册你的用户名和密码</span>
          <!-- <input type="text" placeholder="UserName">
                    <input type="email" placeholder="Email">
                    <input type="password" placeholder="Password">
                    <button @click.prevent="signUp">注册</button> -->

          <el-form :model="registerForm"
                   :rules="registerRule"
                   ref="registerFormRef">
            <el-form-item prop="username">
              <el-input v-model="registerForm.username"
                        maxlength="10"
                        type="text"
                        placeholder="用户名">
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="registerForm.password"
                        maxlength="20"
                        type="password"
                        placeholder="密码">
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password_repeat">
              <el-input v-model="registerForm.password_repeat"
                        maxlength="20"
                        type="password"
                        placeholder="确认密码">
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div style="margin-top: 20px;">
            <el-button @click="register"
                       style="width: 270px"
                       type="warning"
                       plain>注册</el-button>
          </div>
        </form>
      </div>
      <div class="form-container sign-in">
        <form>
          <h1 style="margin-bottom: 20px;">登录</h1>
          <span style="margin-bottom: 20px;">使用你的用户名和密码</span>
          <!-- <input type="text" placeholder="Username">
                    <input type="password" placeholder="Password"> -->
          <el-form :model="loginForm"
                   :rules="loginRule"
                   ref="loginFormRef">
            <el-form-item prop="role"
                          style="width: 220px">
              <el-select v-model="loginForm.role">
                <el-option value="0"
                           label="用户" />
                <el-option value="1"
                           label="管理员" />
              </el-select>
            </el-form-item>

            <el-form-item prop="username">
              <el-input v-model="loginForm.username"
                        maxlength="25"
                        type="text"
                        placeholder="用户名">
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="loginForm.password"
                        type="password"
                        maxlength="20"
                        placeholder="密码">
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div style="margin-top: 20px">
            <el-button @click="userLogin"
                       style="width: 270px"
                       type="success"
                       plain>立即登录</el-button>
          </div>
          <!-- <a href="#">忘记密码?</a>
                    <button @click.prevent="signIn">登录</button> -->
        </form>
      </div>
      <div class="toggle-container">
        <div class="toggle"
             :class="{ active: isActive }">
          <div class="toggle-panel toggle-left">
            <h1>欢迎回来！</h1>
            <p>登录以使用网站所有功能</p>
            <button class="hidden"
                    id="login"
                    @click="switchToLogin">登录</button>
          </div>
          <div class="toggle-panel toggle-right">
            <h1>你好!</h1>
            <p>注册账号以使用网站所有功能</p>
            <button class="hidden"
                    id="register"
                    @click="switchToRegister">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}

body {
  background-color: #c9d6ff;
  background: linear-gradient(to right, #e2e2e2, #c9d6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  margin: 0;
}

.page-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.container p {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
  margin: 20px 0;
}

.container span {
  font-size: 12px;
}

.container a {
  color: #333;
  font-size: 13px;
  text-decoration: none;
  margin: 15px 0 10px;
}

.container button {
  background-color: #512da8;
  color: #fff;
  font-size: 12px;
  padding: 10px 45px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 10px;
  cursor: pointer;
}

.container button.hidden {
  background-color: transparent;
  border-color: #fff;
}

.container form {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  height: 100%;
}

.container input {
  background-color: #eee;
  border: none;
  margin: 8px 0;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 8px;
  width: 100%;
  outline: none;
}

.form-container {
  position: absolute;
  top: 0;
  /* height: 100%; */
  transition: all 0.6s ease-in-out;
  margin-top: 15%;
}

.sign-in {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.active .sign-in {
  transform: translateX(100%);
}

.sign-up {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.active .sign-up {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: move 0.6s;
}

@keyframes move {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.social-icons {
  margin: 20px 0;
}

.social-icons a {
  border: 1px solid #ccc;
  border-radius: 20%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 3px;
  width: 40px;
  height: 40px;
}

.toggle-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  border-radius: 150px 0 0 100px;
  z-index: 1000;
}

.container.active .toggle-container {
  transform: translateX(-100%);
  border-radius: 0 150px 100px 0;
}

.toggle {
  background-color: #512da8;
  height: 100%;
  background: linear-gradient(to right, #5c6bc0, #512da8);
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
}

.container.active .toggle {
  transform: translateX(50%);
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 30px;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
}

.toggle-left {
  transform: translateX(-200%);
}

.container.active .toggle-left {
  transform: translateX(0);
}

.toggle-right {
  right: 0;
  transform: translateX(0);
}

.container.active .toggle-right {
  transform: translateX(200%);
}

.el-form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}
</style>