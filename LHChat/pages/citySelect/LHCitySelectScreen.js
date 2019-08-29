import React, { Component } from 'react';
import {Text,View,FlatList,TouchableHighlight,StatusBar,StyleSheet,SafeAreaView} from 'react-native'
import DGNavigationBar from '../../public/DGNavigationBar';

export default class DGCitySelectScreen extends Component{
    // 路由处理
    static navigationOptions = {
        header:null,    // 隐藏导航栏
    };

    render(){
        return(
            <View style ={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>选择城市</Text>

                     <DGNavigationBar title = '切换城市' 
                                      rightTitle = '确定'
                                      rightOnPress = {this.rightOnPress}
                                      tintColor = '#FFFFFF'
                                      navigation = {this.props.navigation}
                                      />
            </View>
        );
    };
}