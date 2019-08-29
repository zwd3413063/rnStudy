import React ,{Component} from "react"; 
import { View, Text ,Button} from "react-native"; 
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    header:null,    // 隐藏导航栏

  };
   // 这里用{} 将 params 括起来，为ES6的解构参数语法
    detailCallback =({params})=>{
      console.log(params);
    }

      render() { 
          return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}> 
                <Text style = {{color:'red',fontSize:20}}>Home Screen</Text> 
                {/* navigate 是从当前堆栈寻找，如果有了就不会做任何事情了
                    push 是压入一个新的页面。不管之前有没有。所以可以无限循环的压入相同的页面
                */}
                <Button title="Go to Details" 
                        onPress={() =>     
                          {
                            /* 1. Navigate to the Details route with params */
                            this.props.navigation.navigate('Details', {
                              itemId: 86,
                              otherParam: 'anything you want here',
                              subTitle:'我是副标题',
                              callback:this.detailCallback
                            });
                          }}
                          />
                
                <Button onPress={() => this.props.navigation.navigate('MyModal')}
                        title="Info"  
                        />
            </View> );
        } 
} 


class DetailsScreen extends React.Component {

  static navigationOptions = ({navigation})=>{
    return {
      title: navigation.getParam('subTitle'),
      headerTitle:this.headerText,
      headerStyle: {
       backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
       fontWeight: 'bold',
      }
    }
  }

  // 自定义标题视图
  static headerText = ()=>{
   return <Text style ={{color:'red',fontSize:20,backgroundColor:'green'}}>我是标题奥</Text>
  };

  render() {
     /* 2. Get the param, provide a fallback value if not available */
     const { navigation } = this.props;
     const itemId = navigation.getParam('itemId', 'NO-ID');
     const otherParam = navigation.getParam('otherParam', 'some default value');
     let callback = navigation.getParam('callback');

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Text>itemId: {JSON.stringify(itemId)}</Text>
        <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('root')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
          <Button
          title="回到根视图"
          onPress={() => this.props.navigation.popToTop()}
        />
         <Button
          title="回传参数"
          onPress={() => callback({params:'你好北京'})}
        />
      </View>
    );
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}


const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

// const AppNavigator = createStackNavigator({ Home: { screen: HomeScreen } });

// 创建导航控制器
const AppNavigator = createStackNavigator(
  // 这里的home 、 details 就是注册的路由名。跳转时会用到。
  {
    root: HomeScreen,
    Details: DetailsScreen 
  },
  {
    // 指定根视图
    initialRouteName: "root"
  }
);

// createAppContainer 为一个容器方法
const AppContainer = createAppContainer(RootStack);

export default class DGBaseNavigationController extends Component {
  render() {
    return <AppContainer />;
  }
}

