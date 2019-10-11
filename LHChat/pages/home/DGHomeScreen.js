import React, { Component } from 'react';

import {
    View,
    FlatList,
    StyleSheet,
}  from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DGNavigationBar from '../../public/DGNavigationBar'
import DGGlobal from '../../config/DGGlobal';
import LHView from '../../public/LHView';
import LoadingView from '../../public/DGLoadingView';


export default class HomeController extends Component{
    constructor(props){
        super(props);
        this.state = {
            loadType:'start'
        }

        // 加载视图
        // this.loadingView
    }

    componentDidMount() {
        setTimeout(()=>{
            this.setState({loadType:'failed'});
            if(this.loadingView)this.loadingView.loadType = 'failed';
        },3000);
    }

    /*------action------*/
    // 加载失败。重新加载
    againLoadAction = ()=>{
        this.setState({loadType:'start'});
        if(this.loadingView)this.loadingView.loadType = 'start';
        setTimeout(()=>{
            this.setState({loadType:'failed'});
            if(this.loadingView)this.loadingView.loadType = 'failed';
        },3000);
    }

    // 加载视图
    _contentView = (loadType)=>{
        if(loadType == 'start' || loadType == 'failed'){
            return (
                <LoadingView ref = {(ref) => (this.loadingView = ref)} onPress = {this.againLoadAction}></LoadingView>
            )
        }else if(loadType == 'stoped'){
            return (
                <FlatList>

                </FlatList>
            )
        }
    }

    render(){
        return (
            <View style ={{flex:1}}>
                {/* 内容视图 */}
                {this._contentView(this.state.loadType)}
            
                <DGNavigationBar title = {this.state.title} 
                                      tintColor = '#FFFFFF'
                                      navigation = {this.props.navigation}
                                      />
            </View>
        );
    }
}

const styles = StyleSheet.create({

});