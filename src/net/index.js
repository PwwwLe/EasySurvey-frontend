import axios from 'axios'
import { ElMessage } from "element-plus";

const authItemName = "access_token"

const defaultFailure = (message, code, url) => {
    console.warn(`请求地址: ${url}, 状态码: ${code}, 错误消息: ${message}`)
    ElMessage.warning(message)
}

const defaultError = (err) => {
    console.error(err)
    ElMessage.warning("未知错误,请联系管理员")
}


function internalPost(url, queryParams, data, header, success, failure, error = defaultError) {
    console.log(url)
    console.log(data)
    console.log(header)
    console.log(queryParams)

    // 手动拼接查询字符串
    const queryString = Object.keys(queryParams)
        .map(key => `${key}=${queryParams[key].join(',')}`)
        .join('&');
    const fullUrl = `${url}?${queryString}`;

    console.log(fullUrl)
    axios.post(fullUrl, data, { headers: header }).then(({ data }) => {
        console.log(data)
        if (data.code === 1) {
            success(data.data)
        } else {
            defaultFailure(data.message, data.code, url, data)
        }
    }).catch(err => error(err))
}

function internalGet(url, header, success, failure, error = defaultError) {
    console.log(url)
    console.log(header)
    axios.get(url, { headers: header }).then(({ data }) => {
        console.log(data)
        if (data.code === 1) {
            success(data.data)
        } else {
            defaultFailure(data.message, data.code, url)
        }
    }).catch(err => error(err))
}

function internalPut(url, data, header, success, failure, error = defaultError) {
    console.log(url)
    console.log(data)
    console.log(header)

    axios.put(url, data, { headers: header }).then(({ data }) => {
        console.log(data)
        if (data.code === 1) {
            success(data.data)
        } else {
            defaultFailure(data.message, data.code, url, data)
        }
    }).catch(err => error(err))
}

// function internalPatch(url, queryParams, data, header, success, failure, error = defaultError) {
//     console.log(url)
//     console.log(data)
//     console.log(header)
//     console.log(queryParams)
//     const fullUrl = `${url}?${new URLSearchParams(queryParams).toString()}`;
//     console.log(fullUrl)

//     axios.patch(fullUrl, data, { headers: header }).then(({ data }) => {
//         console.log(data)
//         if (data.code === 1) {
//             success(data.data)
//         } else {
//             defaultFailure(data.message, data.code, url, data)
//         }
//     }).catch(err => error(err))
// }
function internalPatch(url, queryParams, data, header, success, failure, error = defaultError) {
    console.log(url)
    console.log(data)
    console.log(header)
    console.log(queryParams)

    // 手动拼接查询字符串
    const queryString = Object.keys(queryParams)
        .map(key => `${key}=${queryParams[key].join(',')}`)
        .join('&');
    const fullUrl = `${url}?${queryString}`;

    console.log(fullUrl)

    axios.patch(fullUrl, data, { headers: header }).then(({ data }) => {
        console.log(data)
        if (data.code === 1) {
            success(data.data)
        } else {
            defaultFailure(data.message, data.code, url, data)
        }
    }).catch(err => error(err))
}


function internalDelete(url, header, success, failure, error = defaultError) {
    console.log(url)
    console.log(header)

    axios.delete(url, { headers: header }).then(({ data }) => {
        console.log(data)
        if (data.code === 1) {
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
    console.log(localStorage.getItem(authItemName))
}

function takeAccessToken() {
    const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName)
    console.log("Token：" + str);
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
    axios.post('/api/login', {
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
            // 获取当前时间
            let currentDate = new Date();
            // 增加一个小时
            currentDate.setHours(currentDate.getHours() + 1);
            storeAccessToken(data.msg, currentDate)
            ElMessage.success(`登陆成功,欢迎 ${data.data.name} 进入!`)
            success(data.data)
        } else {
            defaultFailure(data.msg, data.code, '/api/login')
        }
    }).catch(err => error(err))
}

function Register(username, password, success, failure = defaultFailure) {
    console.log(username)
    console.log(password)
    axios.post('api/register', {
        name: username,
        password: password,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(({ data }) => {
        console.log(data)
        if (data.code === 1) {
            ElMessage.success('注册成功，欢迎加入我们')
            console.warn(`注册成功，欢迎加入我们`)
            success(data.data)
        }
        else {
            defaultFailure(data.msg, data.code, 'api/register')
            //console.warn(`请求地址: /register, 状态码: ${data.code}, 错误消息: ${data.msg}`)
        }
    }).catch(err => error(err))
}

/**
 * 获取请求头
 */
function accessHeader() {
    if (takeAccessToken())
        return {
            //'Authorization': `Bearer ${takeAccessToken()}`
            'Authorization': `${takeAccessToken()}`
        }
    else return {};
}

function get(url, success, failure = defaultFailure) {
    console.log(url)
    internalGet(url, accessHeader(), success, failure)
}

function post(url, queryParams, data, success, failure = defaultFailure) {
    internalPost(url, queryParams, data, accessHeader(), success, failure)
}

function put(url, data, success, failure = defaultFailure) {
    internalPut(url, data, accessHeader(), success, failure);
}

function patch(url, queryParams, data, success, failure = defaultFailure) {
    internalPatch(url, queryParams, data, accessHeader(), success, failure);
}

function del(url, success, failure = defaultFailure) { // delete is a reserved word, so use del instead
    internalDelete(url, accessHeader(), success, failure);
}

// function logout(success, failure = defaultFailure) {
//     get('/api/auth/logout', () => {
//         deleteAccessToken()
//         ElMessage.success(`退出登陆成功`)
//         success()
//     }, failure)
// }

/**
 * 判断是否未验证
 */
function unauthorized() {
    return !takeAccessToken();
}
export { login, get, post, put, patch, del, unauthorized, accessHeader, Register }