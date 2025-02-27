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
    //console.log(url)
    //console.log(header)
    axios.get(url, { headers: header }).then(({ data }) => {
        //console.log(data)
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
    //console.log("Token：" + str);
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
        username: username,
        password: password,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(({ data }) => {
        console.log(data)
        console.log(role)

        if (data.code === 200) {
            // 获取当前时间
            let currentDate = new Date();
            // 增加一个小时
            currentDate.setHours(currentDate.getHours() + 1);
            storeAccessToken(data.token, currentDate)
            success()
        } else {
            defaultFailure(data.msg, data.code, '/api/login')
        }
    }).catch(err => failure(err))
}

const Register = async (username, password, code, uuid) => {
    try {
        const response = await axios.post('/api/register', {
            username: username,
            password: password,
            code: code,
            uuid: uuid
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            ElMessage.success('注册成功！欢迎加入！')
        } else {
            ElMessage.error('注册失败！')
        }
    } catch (error) {
        console.log('注册出现错误：', error)
    }
}

function UploadImage(url, queryParams, data, success, failure = defaultFailure) {
    // 将 Base64 字符串转换为 Blob
    const base64Data = queryParams.file.split(',')[1]; // 去除 data:image/jpeg;base64,
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' }); // 假设 PNG 图片

    const formData = new FormData();
    formData.append('file', blob, 'image.png'); // 附加上述 Blob，使用一个文件名

    // 定义 Axios 配置
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    // 发送请求
    axios.post(url, formData, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                ElMessage.success('上传成功');
                updateAvatar(data.data)
            } else {
                failure(data.msg, data.code, url);
            }
        })
        .catch(err => error(err));
}

function updateAvatar(avatarUrl, failure = defaultFailure) {
    console.log(avatarUrl)
    const queryParams = {
        url: avatarUrl
    }
    const url = '/api/user/updateAvator'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.patch(fullUrl, null, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {

            } else {
                failure(data.msg, data.code, fullUrl);
            }
        })
        .catch(err => error(err));
}

function getImage(avatarUrl, success, failure = defaultError) {
    //console.log(avatarUrl)
    if (avatarUrl == null)
        return
    const queryParams = {
        id: avatarUrl
    }
    const url = '/api/image/getImage'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    //console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            //console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl);
            }
        })
        .catch(err => error(err));
}

function getInfo(success, failure = defaultFailure) {
    console.log(1);

    // 获取 AccessToken 并转换为 Base64 编码（如果必要）
    console.log(takeAccessToken())
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get('/api/getInfo', config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 200) {
                success(data);
            } else {
                failure(data.msg, data.code, fullUrl);
            }
        })
        .catch(err => failure(err));
}

export function getByUserId(userId, success, failure = defaultFailure) {
    const queryParams = {
        userId: userId
    }
    const url = '/api/publish/getByUserId'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function getSurvey(surveyId, success, failure = defaultFailure) {
    const queryParams = {
        surveyId: surveyId
    }
    const url = '/api/option/getAllOptionsStructureBySurveyId'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            //console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function createAnswers(answers, success, failure = defaultFailure) {
    const url = '/api/answer/createAnswers'
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`,
            'Content-Type': 'application/json'
        }
    };

    console.log(answers)

    axios.post(url, answers, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function createResponse(response, success, failure = defaultFailure) {
    const url = '/api/response/createResponse'
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`,
            'Content-Type': 'application/json'
        }
    };

    console.log(response)

    axios.post(url, response, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function getSurveySubmitProgress(surveyId, userId, success, failure = defaultFailure) {
    const queryParams = {
        surveyId: surveyId,
        userId: userId
    }
    const url = '/api/response/getSurveySubmitProgress'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function getSurveyCompletedProgress(surveyId, userId, success, failure = defaultFailure) {
    const queryParams = {
        surveyId: surveyId,
        userId: userId
    }
    const url = '/api/response/getSurveyCompletedProgress'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function getAnswerOfSurveyByUserId(surveyId, userId, success, failure = defaultFailure) {
    const queryParams = {
        surveyId: surveyId,
        userId: userId
    }
    const url = '/api/answer/getAnswerOfSurveyByUserId'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`,
            'Content-Type': 'application/json'
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

/**
 *
 * 获取请求头
 */
function accessHeader() {
    if (takeAccessToken())
        return {
            //'Authorization': `Bearer ${takeAccessToken()}`
            'Authorization': `Bearer ${takeAccessToken()}`,
            'Content-Type': 'application/json'
        }
    else return {};
}

function get(url, success, failure = defaultFailure) {
    //console.log(url)
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

export function getNums(questionId, success, failure = defaultFailure) {
    const queryParams = {
        questionId: questionId
    }
    const url = '/api/answer/getNums'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    // console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            // console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function getTextReport(questionId, success, failure = defaultFailure) {
    const queryParams = {
        questionId: questionId
    }
    const url = '/api/report/getReportForText'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    // console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            // console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export function getCrossReport(questionId1,questionId2, success, failure = defaultFailure) {
    const queryParams = {
        questionId1: questionId1,
        questionId2:questionId2
    }
    const url = '/api/report/getReportForQuestion'
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`
    // console.log(fullUrl)
    const config = {
        headers: {
            'Authorization': `Bearer ${takeAccessToken()}`
        }
    };

    axios.get(fullUrl, config)
        .then(({ data }) => {
            // console.log(data);
            if (data.code === 1) {
                success(data)
            } else {
                failure(data.msg, data.code, fullUrl)
            }
        })
        .catch(err => failure(err));
}

export {
    login,
    get,
    post,
    put,
    patch,
    del,
    unauthorized,
    accessHeader,
    takeAccessToken,
    Register,
    UploadImage,
    getImage,
    getInfo
}
