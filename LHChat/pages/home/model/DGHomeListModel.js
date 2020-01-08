
import {lh_image_base_url} from '../../../config/DGGlobal';

// 距离、上次登录时间描述
userDistance = (item)=>{
    let dis = "";
    if(item.distance < 1000)dis = "距离" + item.distance + "米";
    else dis =  "距离" + parseInt(item.distance/1000)+ "千米";

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
    let url = lh_image_base_url + item.pic;
    return url;
}

export default {
    userDistance,       // 距离、上次登录时间描述 
    userTypeIcon,       // 用户类型
    userHeaderImage,    // 用户头像地址拼接
}