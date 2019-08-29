import React ,{Component}from 'react';
import { Text, View } from 'react-native';
import DGButton from '../public/DGButton'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

class HomeScreen extends Component {

  tabbarIndexAction =()=>{
    console.log('hello!');
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
        <DGButton style ={{flex:1,flexBasis:30,height:30,backgroundColor:'red',flexGrow:0}} 
                  title = 'Show Index' 
                  onPress = {this.tabbarIndexAction}/>
      </View>
    );
  }
}

class SettingsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const getTabBarIcon =(navigation,focused,tintColor)=>{
    let {routeName} = navigation.state;
    let imgName;
    if (routeName === 'Home'){
      imgName = 'home_icon';
    }else if(routeName === 'Settings'){
      imgName = 'my_light_icon';
    }

    let tabbarIndexAction =()=>{
      navigation.navigate('Home');
    };

   return <DGButton style ={{backgroundColor:'red'}} img = {imgName} title = {routeName} onPress ={tabbarIndexAction}></DGButton>;
}

const TabNavigator = createBottomTabNavigator(
    {
        Home: HomeScreen,
        Settings: SettingsScreen,
    },
    {
        defaultNavigationOptions:({navigation})=>({
            tabBarIcon:({focused,tintColor})=>{
              return getTabBarIcon(navigation,focused,tintColor);
            }
        })
    }
);

const Tabbar =  createAppContainer(TabNavigator);

export default class MyTabbarController extends Component{
    render(){
        return(
            <Tabbar></Tabbar>
        );
    }
}