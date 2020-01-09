
import { AsyncStorage } from "react-native";
import LogManager from '../public/LHLoginOutManager';
import Storage,{login_response_info} from '../config/storage/DGAsyncStorage';


// 项目base地址
const lh_base_url = 'http://www.0792kk.cn/';

const lh_header = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',    //表单提交方式。常用的还有 'application/json'
    'Token':'NoToken'
};

let lh_token = 'NoToken';  // 登录token

const lh_body = {
    'version':'1.0.0'
}

// 接口API
const LH_LOGIN_PATH = '/api/user/login';                    // 登录
const LH_HOME_USER_LIST = '/api/user/getUserList';          // 获取首页用户列表
const LH_FETCH_USER_INFO  = "/api/user/getUserDate";        // 获取用户信息
export {
    LH_LOGIN_PATH,
    LH_HOME_USER_LIST,
    LH_FETCH_USER_INFO
};

// 接口回调状态码
const LHNetWorkingCode = {
    successed       : 1,        // 成功
    dataNull        : 2,        // 数据为空
    serverFail      : -10,      // 请求报错
    tokenInvalidate : -1,       // token失效
    systemBusy      : -3,       // 系统繁忙
    dataError       : -3000,    // 数据格式错误
    netError        : 404,      // 网络错误
    codeOther       : 10000,    // 其他错误
}


/**这是一个单例 */
let _networkManger;
export default class LHNetWorking{
    constructor(){
        if(!_networkManger)_networkManger = this;
        return _networkManger;
    }

    static defaultManager(){
        if(_networkManger)return _networkManger;

        let manager = new LHNetWorking();
        return manager;
    }

    post = ({path ='',baseURL=null,header={},body={},successed=null,fail=null})=>{
        let requestPath;    // 请求地址

        // 拼接请求地址
        if(baseURL)requestPath = baseURL + path;
        else  requestPath = lh_base_url+path;

        // 发起请求
        this.fetch(requestPath,header,body,'POST',successed,fail);
    }

    get = ({path ='',baseURL=null,header={},body={},successed=null,fail=null})=>{
        let requestPath;    // 请求地址

        // 拼接请求地址
        if(baseURL)requestPath = baseURL + path;
        else  requestPath = lh_base_url+path;

        // 发起请求
        this.fetch(requestPath,header,body,'GET',successed,fail);
    }

    // 发起请求
    fetch = async (requestPath,header,body,method,successed,fail)=>{
                // 首先得从本地获取token

                if (lh_token == 'NoToken'){
                    try{
                        let data = await Storage.asyncFetch({key:login_response_info});
                        let jsonData = JSON.parse(data);// 字符串转json
                        if(jsonData)lh_token =  jsonData.token;
                    }catch(e){
                        lh_token = 'NoToken';
                    }
                }

                // 拼接请求头
                header = {...lh_header,...{'Token':lh_token},...header};
                // 拼接请求体
                body = {...lh_body,...body};

                // get请求这里不能使用body
                if(method === 'GET'){
                    requestPath = requestPath + "?" + this.paramsFromdata(body);
                    body = '';
                }

                // 发起请求
                fetch(requestPath,
                    {
                        method  :method,
                        headers :header,
                        body    :this.paramsFromdata(body)
                    }
                ).then(
                    (response)=>{
                        /** response  包含了如下几种解析方式:
                            arrayBuffer()
                            json()
                            text()
                            blob()
                            formData()
                        */
                        return response.json();
                    }
                ).then(
                    (json)=>{
                        // token失效
                        if(json.code == LHNetWorkingCode.tokenInvalidate){
                            LogManager.logOut();    // 退出登录
                        }
                        
                        // 成功
                        if(json.code == LHNetWorkingCode.successed){
                            if(successed)successed(json);
                        }
                        //失败
                        else{
                            let error = new LHError(json.message,json.code);
                            if(fail)fail(error); 
                        }
                    }
                ).catch(
                    (error)=>{
                        let lhError = new LHError(error.message,LHNetWorking.netError);
                        if(fail)fail(lhError);
                    }
                )
    }

    // 数据转换成表单格式的。eg:value=123&value1=321
    paramsFromdata = (body)=>{
        if(body.length == 0)return '';
        let bodyString = String();

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                const element = body[key];
                bodyString = bodyString + key + '=' + element +'&';
            }
        }
        if(bodyString.length > 0)bodyString = bodyString.slice(0,-1);//slice字符串截取.从开始一直到倒数第1个字符的前一个字符
        return bodyString;
    };
}


class LHError{
    constructor(message,code){

        this.message = message;
        this.code = code;
    }
}
