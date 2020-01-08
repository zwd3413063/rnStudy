import React, { Component } from 'react';

import {
    View,
    Text,
    SectionList,
    StyleSheet,
}  from 'react-native';

import DGNavigationBar from '../../public/DGNavigationBar';
import HeaderComponent from './view/DGHomeDetailHeaderScreen';
import DGButton from '../../public/DGButton';
import DGGlobal from '../../config/DGGlobal';
import LHNetWorking ,{LH_FETCH_USER_INFO} from '../../config/LHNetWorking';
import LoadingView from '../../public/DGLoadingView';


export default class DGHomeDetailScreen extends Component{
    constructor(){
        super()
        this.state = {
            title:'用户详情',
            userDetailInfo:{},
            section:[{title:'相册',data:['']},{title:'个人资料',data:['']},{title:'其他', data:['约会节目','约会条件','QQ','微信']}]
        }

        // 加载视图
        this.loadingView = null;
    }   

    componentDidMount(){
        // 默认加载数据
        if(this.loadingView)this.loadingView.loadType = 'start';

    if(this.props.navigation.state.params){
            this.fetchUserDetail(this.props.navigation.state.params.item.userId);
        }else{
            if(this.loadingView)this.loadingView.loadType = 'failed';
        }
    }

    // 请求用户详情
    fetchUserDetail = (userId)=>{
        let body = {userId}

        let net = new LHNetWorking.defaultManager();

        net.get({
            path:LH_FETCH_USER_INFO,
            body:body,
            successed:(ponse)=>{
                console.log(ponse);
                this.setState({userDetailInfo:ponse.data});
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


    _renderItem = (item)=>{
        return (
            <View style={{flex:1, height:44}}>
                 <Text style = {{color:'red'}}>{item.index}</Text>
            </View>
        )
    }

    render(){
        return(
            <View id = 'mainView' style = {style.main}>
                {/* 内容section视图 */}
                <SectionList id = 'contentView' 
                             style = {style.contentView} 
                             ListHeaderComponent = {<HeaderComponent style = {{height:300}} userInfo = {this.state.userDetailInfo}></HeaderComponent>}
                             sections = {this.state.section}
                             renderItem = {item =>(this._renderItem(item))}
                />

                {/* 底部选择视图 */}
                <View id = 'bottomView' style = {[style.bottomView,{flexBasis:g_screen.tabbarHeight}]}>
                    <DGButton   id = 'commentBtn'
                                style = {{flex:1}}
                                title ='评价' 
                                img ='appraise_icon' 
                                arrangeType = 'imageInTop' 
                                titleColor = '#333333' 
                                titleFont = {10}></DGButton>

                    <DGButton   id = 'ChatBtn' 
                                style = {{flex:1}}  
                                title ='私聊' 
                                img ='chat_icon' 
                                arrangeType = 'imageInTop' 
                                titleColor = '#333333' 
                                titleFont = {10}></DGButton>
                </View>

                {/* 加载视图 */}
                <LoadingView  ref = {(ref) => (this.loadingView = ref)} onPress = {this.againLoadAction}></LoadingView>

                {/* 导航栏 */}
                <DGNavigationBar title          = {this.state.title} 
                                tintColor       = '#FFFFFF'
                                navigation      = {this.props.navigation}
                                backgroundColor = 'rgba(0,0,0,0)'
                />
            </View>
        )
    }
}

const style = StyleSheet.create({
    main:{
        flex:1,
        flexDirection:'column',
    },
    contentView:{
        flexGrow:1,
        backgroundColor:'#F6F4F9'
    },
    bottomView:{
        flex:1,
        flexDirection:'row',
        flexBasis:49,
        flexGrow:0
    }
});
