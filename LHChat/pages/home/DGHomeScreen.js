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
import DGButton from '../../public/DGButton';
import RNLocation from 'react-native-location'; // 定位功能
import LocationManager from '../../config/DGLocation';
import HomeItem from './DGHomeItem';

import LHNetWorking ,{LH_HOME_USER_LIST} from '../../config/LHNetWorking';


export default class HomeController extends Component{
    constructor(props){
        super(props);
        this.state = {
            datas:[]
        }
        // 加载视图
        this.loadingView = null;
    }

    componentDidMount() {
        // 默认加载数据
        this.defaultFetch();
    }

    defaultFetch(){
        // 1.1请求定位信息
        LocationManager.fetch((location)=>{
            // 1.2请求首页数据
            this.fetchUserlist(location);
        });
    }

    // 请求首页数据
    fetchUserlist = (location)=>{
        let body = {'latitude'   :location.latitude,
                    'longitude'  :location.longitude,
                    'page'       :'1',
                    'pageSize'   :'20',
                    'sex'        :'2'
                   }

        let net = new LHNetWorking.defaultManager();

        if(this.loadingView)this.loadingView.loadType = 'start';
        net.get({
            path:LH_HOME_USER_LIST,
            body:body,
            successed:(ponse)=>{
                console.log(ponse);
                this.setState(state =>({datas:ponse.data}));
                if(this.loadingView)this.loadingView.loadType = 'stoped';
            },
            fail:(error)=>{
                console.log(error);
                if(this.loadingView)this.loadingView.loadType = 'failed';
            }
        });
    }

    /*------action------*/
    // 加载失败。重新加载
    againLoadAction = ()=>{
        // 默认加载数据
        this.defaultFetch();
    }

    onPressItem = (item)=>{
        console.log(item);
    }

    /*-------create View------*/
    // 顶部搜索视图
    createTopCenterView = ()=>{
        return (
         <DGButton style = {{flex:1,flexGrow:1,backgroundColor:'rgba(0,0,0,0.1)',marginTop:7,marginBottom:7,borderRadius: 15}} 
                   title = '搜索你喜欢的用户/职业'
                   tintColor = '#D685A0'
                   titleFont = {12}>
         </DGButton>
        );
    }


    render(){
        return (
            <View style ={{flex:1}}>
                    <FlatList style = {{flex:1,marginTop:g_screen.topHeight}}
                              data = {this.state.datas}
                              renderItem = {(item) =>(<HomeItem itemData = {item} onPress = {this.onPressItem}></HomeItem>)}
                              keyExtractor = {(item,index)=>(String(item.userId))}
                              

                    />
                        

                    <LoadingView  ref = {(ref) => (this.loadingView = ref)} onPress = {this.againLoadAction}></LoadingView>
            
                <DGNavigationBar title = {this.state.title} 
                                 tintColor   = '#FFFFFF'
                                 navigation  = {this.props.navigation}
                                 contentView = {this.createTopCenterView()}
                                 rightTitle  = '查看全部'
                                 leftTitle   = '长沙'
                                 leftImage   = 'address_icon'
                                      />
            </View>
        );
    }
}

const styles = StyleSheet.create({

});