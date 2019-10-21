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
import Storage,{login_response_info} from '../config/storage/DGAsyncStorage';

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


// 等待的视图
export class LoadingScreen extends Component{
    render (){
        return (
        <View style = {{flex:1,backgroundColor:'green'}}>
        </View>
        );
    }
} 


export default class LoginRootScreen extends Component{
    constructor(){
        super();
        this.state = {
            initialRouteName :'load'
        }
    }

    componentDidMount(){
        // 判断登录状态
        Storage.fetch({key:login_response_info},(data,error)=>{
           if(data)this.setState((state)=>({initialRouteName:'tabbarModal'}));
           else  this.setState((state)=>({initialRouteName:'Main'}));
        });
    }
    
    didLoadInitialRoute = (initialRouteName)=>{
        if(initialRouteName == 'load'){
            return( 
                <View style = {{flex:1,backgroundColor:'green'}}>
                </View>
            );
        }

        // 创建根screen
        const RootStack = createStackNavigator(
                {
                    Main: {screen: loginStack},
                    tabbarModal: { screen: tabbarStack},
                },
            {
                mode: 'modal',
                headerMode: 'none',
                initialRouteName : initialRouteName,
                defaultNavigationOptions:({navigation})=>(
                    {gesturesEnabled:false} // 禁止手势滑动退出，这里的模态居然在iOS中也可以压入
                )
            }
        );
        let LoginController =  createAppContainer(RootStack);

        return (
            <LoginController  
            ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef);}}
           />
        );

    }
    
    render(){
        // 指定视图
       return this.didLoadInitialRoute(this.state.initialRouteName);
    }
}



