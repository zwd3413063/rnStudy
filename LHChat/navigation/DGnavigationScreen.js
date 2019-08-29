import React, { Component } from 'react';
import {Text,View,FlatList,TouchableHighlight,Platform,StyleSheet,SafeAreaView} from 'react-native';
import DGNavigationBar from '../../public/DGNavigationBar';

export default class DGNavigationScreen extends Comment{
    constructor(){
        super();
    }

    static navigationOptions = {
        title: 'title',
        header:null,    // 隐藏导航栏
      };

    render(){
      return(
          <View>
              <DGNavigationBar style = {styles.navigator}>
                
              </DGNavigationBar>
          </View>
      );  
    };
}

const styles = StyleSheet.create({
    navigator:{
        backgroundColor:'red',
    }
}
);