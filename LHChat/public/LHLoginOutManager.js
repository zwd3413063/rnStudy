
import DGAlertView from './DGAlertView';
import NavigationService  from '../config/NavigationService';


export default class LHLoginOutManager{
    static logOut = ()=>{
        DGAlertView.show({
            title:'提示',
            message:'您的登录信息已过期，或已在其他设备上登录，请重新登录!',
            actions:['确定'],
            onPress:(index)=>{
                //强制退出
                NavigationService.reset('Main');
            }
        });
    }

}