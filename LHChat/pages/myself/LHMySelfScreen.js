import React, { Component } from 'react';
import {Text,View,Button} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import DGNavigationBar from '../../public/DGNavigationBar';


export default class LHMyselfScreen extends Component{
    constructor(){
        super();

        this.state = {
            title:'个人中心'
        };
    }

       // 路由处理
       static navigationOptions = {
        header:null,    // 隐藏导航栏
    };

    loginAction = ()=>{
        /*创建一个新的堆栈,加载到当前窗口。并销毁之前的所有堆栈。当然这个堆栈必须是之前已经压入过的。
            index： 新的堆栈，呈现的栈级。配合actions使用。
            actions：新加载的堆栈信息。如果是多个堆栈页面。那个可以通过index：告诉RN，当前要呈现第几栈。
        */
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Main' })
            ],
          });
          this.props.navigation.dispatch(resetAction);
    };

    userInfoSetAction = () =>{
        this.props.navigation.navigate('userInfo');
    };

    render(){
        return(
            <View style ={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text>个人中心</Text>
                <Button onPress ={this.loginAction} title = '退出登录'/>
                <Button onPress ={this.userInfoSetAction} title = '个人中心'/>

                <DGNavigationBar title = {this.state.title} 
                                      tintColor = '#FFFFFF'
                                      navigation = {this.props.navigation}
                                      />
            </View>
        );
    }
}