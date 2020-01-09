
import {lh_image_base_url} from '../../../config/DGGlobal';

// 距离、上次登录时间描述
userDistance = (item)=>{
    let dis = "";
    if(item.distance < 1000)dis = item.distance + "m";
    else dis = parseInt(item.distance/1000)+ "km";

    if(item.updateTime >0){
        let currentTimestemp =  Date.parse(new Date());
        let difference = (currentTimestemp - item.updateTime)/1000;
        if (difference < 60)dis = dis + ".刚刚";
        else if (difference <60*60)dis = dis + "." + difference/60 + "分钟前";
        else if (difference <60*60*24)dis = dis + "." + difference/(60*60) + "小时前";
        else if (difference <60*60*24*30)dis = dis + "." + difference/(60*60*24) + "天前";
        else  dis = dis + "." + difference/(60*60*24*30) + "个月前";
    }
    return dis;
}

// 用户类型
userTypeIcon = (item)=>{
    if(item.isQuality)return "yz_icon";
    if(item.state == '3') return "really_icon";
    return null;
}

// 用户头像地址拼接
userHeaderImage = (item)=>{
    let url = lh_image_base_url + item.picPath;
    return url;
}

// 职业|年龄|城市
basicInfoDescription = (item)=>{
    let des = '';
    if(item.career)des = item.career;
    if(item.age)des = des + "|" + item.age;
    if(item.city)des = des + "|" + item.city;
    return des;
}

// 约会范围
appointmentDescription = (item)=>{
    if(item.datingRange)return '约会范围:' + item.datingRange;
    return '约会范围: 不定';
}

//状态描述 1 资料未完成 2 待认证 3 认证完成 4 认证失败  5 审核中 10 封号
stateTxt = (item)=>{
    if(item.state == 3)return 'TA通过了微信朋友圈的安全认证';
    return 'TA还没认证身份的真实性';
}
export default {
    userDistance,           // 距离、上次登录时间描述 
    userTypeIcon,           // 用户类型
    userHeaderImage,        // 用户头像地址拼接
    basicInfoDescription,   // 职业|年龄|城市
    appointmentDescription, // 约会范围
    stateTxt,               // 状态描述
}