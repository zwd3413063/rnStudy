import React, { Component } from 'react';
import {Text,View,FlatList,TouchableHighlight,StatusBar,StyleSheet,Button,Modal} from 'react-native'
import DGNavigationBar from '../../public/DGNavigationBar';
import NavigationService  from '../../config/NavigationService';
import DGAlertView from '../../public/DGAlertView';
import LHView from '../../public/LHView';

export default class LHUserInfoScreen extends Component{
    constructor(){
        super();
    }
    // alert show action
    showAlertAction = ()=>{
        this.alert.show({
            title:'提示',
            message:'是否退出当前账号?',
            actions:['取消','确认'],
            onPress:this.logoutAction
        });
    };

    showAlertStaicAction = ()=>{
      DGAlertView.show({
            title:'提示',
            message:'直接通过AppRegistry，将DGAlertView 预装在根组件在。无需在每个screen中添加<DGAlertView/>。【窗口3秒后自动关闭】',
            actions:['确认'],
            onPress:this.logoutAction
        });
    }

    logoutAction =(index)=>{
        if(index == 1){
            NavigationService.reset('Main');
        }
        clearTimeout(this.timer);
    };
    
    render(){
        return(
            <LHView style = {{flex:1,justifyContent: 'center',alignItems: 'center'}} navigation = {this.props.navigation}>
                <Text>个人中心</Text>
                <Button title = '退出登录' onPress ={this.showAlertAction}></Button>

                <Button title = '直接DGAlertView.show' onPress ={this.showAlertStaicAction}></Button>

                <DGAlertView ref ={(ref)=>(this.alert = ref)} />
            </LHView>
        )
    };
}