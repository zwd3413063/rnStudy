import React, { Component } from 'react';
import {Text,View,FlatList,TouchableHighlight,StatusBar,StyleSheet,createAppContainer} from 'react-native'
import DGNavigationBar from '../public/DGNavigationBar';
import NavigationService  from '../config/NavigationService';

export default class LHView extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style ={[{flex:1,justifyContent:'center',alignItems:'center'},this.props.style]}>

            {/* his.props.children ，拿到所有的子节点。如果此处不写。将无法在使用LHView时显示它的子View组件*/}
            {this.props.children} 

            <DGNavigationBar {...this.props}/>
            </View>
        );
    };
}