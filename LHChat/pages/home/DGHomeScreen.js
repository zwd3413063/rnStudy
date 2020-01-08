import React, { Component } from 'react';

import {
    View,
    FlatList,
    StyleSheet,
}  from 'react-native';

import DGNavigationBar from '../../public/DGNavigationBar'
import DGGlobal from '../../config/DGGlobal';
import LHView from '../../public/LHView';
import LoadingView from '../../public/DGLoadingView';
import DGButton from '../../public/DGButton';
import RNLocation from 'react-native-location'; // 定位功能
import LocationManager from '../../config/DGLocation';
import HomeItem from './DGHomeItem';
import RefreshList from '../../public/DGRefresh/DGRefreshList';

import LHNetWorking ,{LH_HOME_USER_LIST} from '../../config/LHNetWorking';



export default class HomeController extends Component{
    constructor(props){
        super(props);
        this.state = {
            datas:[]
        }
        // 当前数据页面
        this.dataPage = 1;

        // 位置信息
        this.location = null;

        // 加载视图
        this.loadingView = null;
        // 列表
        this.refreshList = null;
    }

    componentDidMount() {
        // 默认加载数据
        if(this.loadingView)this.loadingView.loadType = 'start';
        this.defaultFetch();
    }

    defaultFetch = () =>{
        // 1.1请求定位信息
        LocationManager.fetch((location)=>{
            this.location = location;
            // 1.2请求首页数据
            this.fetchUserlist(location);
        });
    }

    // 请求首页数据
    fetchUserlist = (location)=>{
        let body = {'latitude'   :location.latitude,
                    'longitude'  :location.longitude,
                    'page'       :this.dataPage,
                    'pageSize'   :'20',
                    'sex'        :'2'
                   }

        let net = new LHNetWorking.defaultManager();

        net.get({
            path:LH_HOME_USER_LIST,
            body:body,
            successed:(ponse)=>{
                console.log(ponse);
                let datas= [];
                if(this.dataPage == 1){
                    datas =  ponse.data;
                }else{
                    datas = this.state.datas;
                    datas.push(...ponse.data);
                }
                this.setState(state =>({datas}));
                // 刷新加载视图
                if(this.loadingView)this.loadingView.loadType = 'stoped';
                if(this.refreshList)this.refreshList.reloadData();
            },
            fail:(error)=>{
                console.log(error);
                // 刷新加载视图
                if(this.loadingView)this.loadingView.loadType = 'failed';
                if(this.refreshList)this.refreshList.reloadData({isfail:true});
            }
        });
    }
    /*--------下拉、上拉列表的触发函数---------*/
    // 下拉刷新数据 
    onRefresh  = ()=>{
        this.dataPage = 1;
        this.fetchUserlist(this.location);
    }


    // 上拉加载更多
    onEndReached = ()=>{
        this.dataPage++;
        this.fetchUserlist(this.location);
    }

    /*------action------*/
    // 加载失败。重新加载
    againLoadAction = ()=>{
        // 默认加载数据
        this.defaultFetch();
    }

    onPressItem = (item)=>{
        this.props.navigation.navigate('homeDetail',item);
    }

    /*-------create View------*/
    // 顶部搜索视图
    createTopCenterView = ()=>{
        return (
         <DGButton style = {{flex:1,flexGrow:1,backgroundColor:'rgba(0,0,0,0.1)',marginTop:7,marginBottom:7,borderRadius: 15}} 
                   title = '搜索你喜欢的用户/职业'
                   titleColor = '#D685A0'
                   titleFont = {12}>
         </DGButton>
        );
    }


    render(){
        return (
            <View style ={{flex:1}}>
                    <RefreshList style = {{flex:1,marginTop:g_screen.topHeight}}
                              data = {this.state.datas}
                              renderItem = {(item) =>(<HomeItem itemData = {item} onPress = {this.onPressItem}></HomeItem>)}
                              keyExtractor = {(item,index)=>(String(item.userId))}
                              onRefresh = {this.onRefresh}
                              onEndReached = {this.onEndReached} 
                              ref = {(ref) =>{this.refreshList = ref}}
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