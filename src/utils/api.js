import axios from "axios";
import {Message} from 'element-ui';
import router from "../router";


//相应结果拦截器
axios.interceptors.response.use(success => {
    //业务逻辑错误
    if (success.status && success.status === 200) {
        let code = success.data.code;
        if (code !== 0) {
            Message.error({message: success.data.message});
            if (code === 1 || code === 51) {
                //跳转登录页
                this.$router.replace("/")
            }
            return;
        }
        if (success.data.message) {
            Message.success({message: success.data.message});
        }
    }
    return success.data;
}, error => {
    if (error.response.code === 504 || error.response.code === 404) {
        Message.error({message: '服务器被吃了( ╯□╰ )'});
    } else if (error.response.code === 403) {
        Message.error({message: '权限不足，请联系管理员！'})
    } else if (error.response.code === 401) {
        Message.error({message: '尚未登陆，请登录！'});
        router.replace('/');
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message})
        } else {
            Message.error({message: '未知错误！'})
        }
    }

});

let base = '';

//传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
//传递json的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
//传递json的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}
//传递json的delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
