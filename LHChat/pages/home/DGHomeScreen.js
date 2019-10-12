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
import LHNetWorking ,{LH_HOME_USER_LIST} from '../../config/LHNetWorking';


export default class HomeController extends Component{
    constructor(props){
        super(props);
        this.state = {
            loadType:'start'
        }
        // 加载视图
        this.loadingView = null;
    }

    componentDidMount() {
        if(this.loadingView)this.loadingView.loadType = 'start';
        setTimeout(()=>{
            if(this.loadingView)this.loadingView.loadType = 'failed';
        },3000);

        // 默认加载数据
        this.defaultFetch();
    }

    defaultFetch(){
        this.startLocation((location)=>{
            // 请求首页数据
            this.fetchUserlist(location);
        });
    }

    // 获取定位信息
    startLocation = (callback)=>{
        let isFetched = false;  // 避免多次调用成功回调

        // 获取定位信息
        RNLocation.configure({
            // allowsBackgroundLocationUpdates: true, // 打开后台定位。同时别忘记了在xcode中打开项目的后台开关
            distanceFilter: 100.0 // 最小更新距离依据（米）
          })

        // 发起定位          
        RNLocation.requestPermission({
            ios: "whenInUse", //  or 'always'
            android: {
              detail: "coarse" // or 'fine' ，如果你需要使用fine 那就必须在 AndroidManifest.xml 中，配置这一行<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
            }
        }).then(granted => {
              if (granted) {
                this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                    // 获取定位信息成功
                    if(locations.length > 0){
                        if (!isFetched){
                            isFetched = true;
                            let location = locations[0];
                            if(callback)callback(location);
                        }
                    }
                })
              }
        })
    }

    // 请求首页数据
    fetchUserlist = (location)=>{
        console.log(location.latitude+'-----'+location.longitude);

        let body = {'latitude'   :location.latitude,
                    'longitude'  :location.longitude,
                    'page'       :'1',
                    'pageSize'   :'20',
                    'sex'        :'2'
                   }

        let net = new LHNetWorking.defaultManager();
        net.post({
            path:LH_HOME_USER_LIST,
            body:body,
            successed:(ponse)=>{
                console.log(ponse);
                hud.message = '登录成功!';
                hud.mode = 'succeeded';
                hud.hidden(2000);

                this.props.navigation.navigate('tabbarModal');
                
            },
            fail:(error)=>{
                console.log(error);
                hud.message = error.message;
                hud.mode = 'failed';
                hud.hidden(2000);
            }
        });
    }

    /*------action------*/
    // 加载失败。重新加载
    againLoadAction = ()=>{
        if(!this.loadingView.isLoading){
            if(this.loadingView)this.loadingView.loadType = 'start';
            setTimeout(()=>{
                if(this.loadingView)this.loadingView.loadType = 'stoped';
            },3000);
        }
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
                    <FlatList style = {{flex:1}}>

                    </FlatList>

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