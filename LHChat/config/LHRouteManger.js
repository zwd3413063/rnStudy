import React ,{Component} from "react"; 
import { createStackNavigator, createBottomTabNavigator ,createAppContainer } from "react-navigation";
import { Text, View ,Image} from 'react-native';

import NavigationService from './NavigationService';
import DGGlobal from './DGGlobal';

import DGLoginScreen from '../pages/login/DGLoginScreen';
import DGHomeScreen from '../pages/home/DGHomeScreen';
import LHMyselfScreen from "../pages/myself/LHMySelfScreen";
import DGCitySelectScreen from '../pages/citySelect/LHCitySelectScreen';
import LHUserInfoScreen from '../pages/myself/LHUserInfoScreen';

// 各个导航控制器
const loginStack = createStackNavigator(
    {
        root:DGLoginScreen
    },
    {
        initialRouteName:'root',
        headerMode: 'none',         // 隐藏导航栏
    }
);

const homeStack = createStackNavigator(
    {
        root :DGHomeScreen,
        selectCity : DGCitySelectScreen
    },
    {
        initialRouteName:'root',
        headerMode: 'none',         // 隐藏导航栏
        navigationOptions:({navigation}) =>(
            // 是否显示 tabar 。 只有index 为0时显示。表示为跟视图
            {tabBarVisible:navigation.state.index === 0} // 隐藏标签栏
        )
    }
);
 
    //个人中心
const MyselfStack = createStackNavigator(
    {
        root :LHMyselfScreen,
        userInfo:LHUserInfoScreen,
    },
    {
        initialRouteName:'root',
        headerMode: 'none',         // 隐藏导航栏
        navigationOptions:({navigation}) =>(
            // 是否显示 tabar 。 只有index 为0时显示。表示为跟视图
            {tabBarVisible:navigation.state.index === 0} // 隐藏标签栏
        )
    }
);

// 创建标签控制器
const tabbarStack = createBottomTabNavigator(
    {
        home:homeStack,
        myself:MyselfStack,
    },
    {
        defaultNavigationOptions:({navigation})=>({
            tabBarIcon:({focused,tintColor})=>{
              return getTabBarIcon(navigation,focused,tintColor);
            }
        }),
        tabBarOptions: {
            activeTintColor: '#E10B68',
            inactiveTintColor: 'gray',
            tabBarVisible:false
        }
    }
)

// 创建根screen
const RootStack = createStackNavigator(
    {
      Main: {screen: loginStack},
      tabbarModal: { screen: tabbarStack},
    },
    {
      mode: 'modal',
      headerMode: 'none',
      initialRouteName : global.user.autoLogin? 'tabbarModal':'Main',
      defaultNavigationOptions:({navigation})=>(
          {gesturesEnabled:false} // 禁止手势滑动退出，这里的模态居然在iOS中也可以压入
      )
    }
);


const LoginController =  createAppContainer(RootStack);

export default class LoginRootScreen extends Component{
    render(){
        return(
           <LoginController  
           ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef);}}
          />
        );
    }
}

// 定义tabbar图片
const getTabBarIcon =(navigation,focused,tintColor)=>{
    let {routeName} = navigation.state;
    let imgName;
    if (routeName === 'home'){
      imgName = focused? 'home_light_icon':'home_gray_icon';
    }else if(routeName === 'myself'){
      imgName = focused? 'my_light_icon':'my_gray_icon';
    }
    let tabbarIndexAction =()=>{
      navigation.navigate('Home');
    };

   return <Image style ={{height:20,width:20}} source = {{uri:imgName}}></Image>;
}


