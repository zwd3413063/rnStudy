import {Dimensions,Platform,PixelRatio} from  'react-native';

const {width, height} = Dimensions.get('window');
const  OS = Platform.OS;
const isIos = (OS == 'ios');
const isAndroid = (OS == 'android');

const  isIPhoneX      = (isIos && height == 812 && width == 375);
const  isIPhoneXS     = (isIos && height == 812 && width == 375);
const  isIPhoneXS_Max = (isIos && height == 896 && width == 414);
const  isIPhoneXR     = (isIos && height == 896 && width == 414);

const g_unify_top_height = isAndroid? 44:64;

const g_tabbarHeight = (isIPhoneX || isIPhoneXS || isIPhoneXS_Max || isIPhoneXR)? 83:49;
const g_topbarHeight = (isIPhoneX || isIPhoneXS || isIPhoneXS_Max || isIPhoneXR)? 88:g_unify_top_height;

const lh_image_base_url = "http://foxcommunity.oss-cn-beijing.aliyuncs.com";

global.g_screen = {
    width:width,
    height:height,
    topHeight:g_topbarHeight,
    tabbarHeight:g_tabbarHeight
};

global.g_device = {
    isIos:isIos,
    isAndroid:isAndroid
}

global.g_color ={
    mainColor:'#E10B68'
}

global.user ={
    autoLogin:false
}

export {lh_image_base_url,isIos,isAndroid};
