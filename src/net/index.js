import axios from 'axios'
import { ElMessage } from "element-plus";

const authItemName = "access_token"

const defaultFailure = (message, code, url, data) => {
    console.warn(`请求地址: ${url}, 状态码: ${code}, 错误消息: ${message}`)
    ElMessage.warning(message)
}

const defaultError = (err) => {
    console.error(err)
    ElMessage.warning("未知错误,请联系管理员")
}


function internalPost(url, data, header, success, failure, error = defaultError) {
    console.log(url)
    console.log(data)
    console.log(header)

    axios.post(url, data, { headers: header }).then(({ data }) => {
        if (data.code === 1) {
            success(data.data)
        } else {
            defaultFailure(data.message, data.code, url, data)
        }
    }).catch(err => error(err))
}

function internalGet(url, header, success, failure, error = defaultError) {
    axios.get(url, { headers: header }).then(({ data }) => {
        if (data.code === 200) {
            success(data.data)
        } else {
            defaultFailure(data.message, data.code, url)
        }
    }).catch(err => error(err))
}

function storeAccessToken(token, expire) {
    const authObj = { token: token, expire: expire }
    const str = JSON.stringify(authObj);
    localStorage.setItem(authItemName, str)
}

function takeAccessToken() {
    const str = localStorage.getItem(authItemName)
    if (!str) return null;
    const authObj = JSON.parse(str)
    if (new Date(authObj.expire) <= new Date()) {
        deleteAccessToken()
        ElMessage.warning("登录状态已过期,请重新登陆")
        return null;
    }
    return authObj.token
}

function deleteAccessToken() {
    localStorage.removeItem(authItemName)
    sessionStorage.removeItem(authItemName)
}

function login(username, password, role, success, failure = defaultFailure) {
    axios.post('/login', {
        name: username,
        password: password,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(({ data }) => {
        console.log(data)
        console.log(role)
        if (data.code === 1 && data.data.role === Number(role)) {
            storeAccessToken(data.data.token, data.data.expireDate)
            ElMessage.success(`登陆成功,欢迎 ${data.data.username} 进入!`)
            success(data.data)
        } else {
            defaultFailure(data.data.message, data.data.code, url, data.data)
        }
    }).catch(err => error(err))
}

/**
 * 获取请求头
 */
function accessHeader() {
    if (takeAccessToken())
        return {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    else return {};
}

function get(url, success, failure = defaultFailure) {
    internalGet(url, accessHeader(), success, failure)
}

function post(url, data, success, failure = defaultFailure) {
    internalPost(url, data, accessHeader(), success, failure)
}

function logout(success, failure = defaultFailure) {
    get('/api/auth/logout', () => {
        deleteAccessToken()
        ElMessage.success(`退出登陆成功`)
        success()
    }, failure)
}

/**
 * 判断是否未验证
 */
function unauthorized() {
    return !takeAccessToken();
}
export { login, logout, get, post, unauthorized, accessHeader }