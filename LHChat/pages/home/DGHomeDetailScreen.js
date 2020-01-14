import React, { Component } from 'react';

import {
    View,
    Text,
    SectionList,
    StyleSheet,
}  from 'react-native';

import DGNavigationBar from '../../public/DGNavigationBar';
import HeaderComponent from './view/DGHomeDetailHeaderScreen';
import DGButton from 'dg-public/DGButton'; // 使用相对路径只需要在对应的文件下添加一个pageage.json文件，加入{"name":"xxx"}即可
import DGGlobal from '../../config/DGGlobal';
import LHNetWorking ,{LH_FETCH_USER_INFO} from '../../config/LHNetWorking';
import LoadingView from '../../public/DGLoadingView';
import UserInfo from './model/LHUserInfo';
import UserPhotosItemScreen from './view/DGUserPhotosItemScreen';


export default class DGHomeDetailScreen extends Component{
    constructor(){
        super()
        this.state = {
            title:'用户详情',
            userDetailInfo:{},
            section:[{title:'相册',key:'0',data:['']},
                     {title:'个人资料',key:'1',data:['']},
                     {title:'其他',key:'2',data:['约会节目','约会条件','QQ','微信']}]
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
                let userModel = new UserInfo(ponse.data);
                this.setState((state)=> ({userDetailInfo:userModel}));
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

    // 每一行的内容
    _renderItem = (item,index,section)=>{
        // 1、相册
        if(section.key == '0'){
            return (
                <UserPhotosItemScreen   style = {{height:105}}
                                        imageModels = {this.state.userDetailInfo.imageModels}
                                        showPhoto = {this.state.userDetailInfo.showPhoto}
                                        photoMoney = {this.state.userDetailInfo.photoMoney}
                />
            )
        }

        // 2、个人介绍
        if(section.key == '1'){
            return(
                <View style ={{flex:1,paddingTop:8,paddingBottom:8,backgroundColor:"#FFFFFF",borderBottomWidth:0.5,borderBottomColor:'#DCDCDC'}}>
                    <Text style ={{color:'#999999',fontSize:12,marginLeft:20,marginRight:20,marginBottom:10}}>
                        简介:<Text style ={{color:'#333333',fontSize:12}}>{this.state.userDetailInfo.introduction}</Text>
                    </Text>
                    <DGButton style = {{backgroundColor:g_color.mainColor,marginLeft:20,marginRight:20,height:26,borderRadius: 13}}
                              title = '查看TA的动态' 
                              titleColor ='#FFFFFF'></DGButton>
                </View>
            );
        }

        // 3、其他信息
        if(section.key == '2'){
            let value = '';
            let detailTitleColor = '#999999';
            // 约会节目 
            if (index == 0)value = this.state.userDetailInfo.datingProgram? this.state.userDetailInfo.datingProgram:"暂未设置"; 
            // 约会条件
            if (index ==1)value = this.state.userDetailInfo.datingCondition? this.state.userDetailInfo.datingCondition:"暂未设置";
            // QQ
            if (index == 2){
                if(this.state.userDetailInfo.showQQ){
                    value = this.state.userDetailInfo.qq;
                    detailTitleColor = '#999999';
                }else{
                    value = "点击获取QQ";
                    detailTitleColor = g_color.mainColor;
                }
            }
            // 微信
            if (index == 3){
                if(this.state.userDetailInfo.showWechat){
                    value = this.state.userDetailInfo.wechat;
                    detailTitleColor = '#999999';
                }else{
                    value = "点击获取微信";
                    detailTitleColor = g_color.mainColor;
                }
            }
            return (
                <View style={style.renderItem}>
                     <Text id = 'title' style = {{flexGrow:0,flexBasis:100,marginLeft:20,color:'#333333',fontSize:14}}>{item}</Text>
                     <Text id = 'detailTitle' style = {{flex:1,color:detailTitleColor,fontSize:14}}>{value}</Text>
                </View>
            )
        }

        return null;
    }

    // 指定key
    _keyExtractor = (item,index)=>{
        return  index.toString();
    }

    // section头
    _sectionHeader = (section)=>{
        if (section.section.key == '2')return null;

        return(
            <View style = {style.sectionHeader}>
                <Text style={{color:'#333333',fontSize:14}}>{section.section.title}</Text>
            </View>
        )
    }

  
    render(){
        return(
            <View id = 'mainView' style = {style.main}>
                {/* 内容section视图 */}
                <SectionList id = 'contentView' 
                             style = {style.contentView} 
                             ListHeaderComponent = {<HeaderComponent style              = {{height:370}} 
                                                                      userDetailInfo    = {this.state.userDetailInfo} 
                                                                      userInfo          = {this.props.navigation.state.params.item}></HeaderComponent>}
                             sections = {this.state.section}
                             renderItem = {({item,index,section}) =>(this._renderItem(item,index,section))}
                             renderSectionHeader = {(section)=>(this._sectionHeader(section))}
                             keyExtractor = {(item,index)=>(this._keyExtractor(item,index))}
                             extraData = {this.state.userDetailInfo}    // 指定列表刷新的state，不然可能不会触发刷新
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
        flexGrow:0,
        borderTopWidth:0.5,
        borderColor:'#DCDCDC'
    },
    sectionHeader:{
        flex:1,
        paddingLeft:20,
        height:30,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'#FFFFFF'
    },
    renderItem:{
        flex:1, 
        height:44,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'#FFFFFF',
        borderBottomWidth:0.5,
        borderColor:'#DCDCDC'
    }
});
