import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Button
}  from 'react-native';

import ListModel from '../model/DGHomeListModel';
import DGButton from '../../../public/DGButton';

export default class HomeDetailHeaderScreen extends Component{

    constructor(){
        super()

    }

    render(){
        return(
            <View id ='mainView' style ={[style.main,this.props.style]}>
                {/* 背景图片 */}
                <Image id = 'backImageView' 
                    style ={[style.backImageView,{height:this.props.style.height? this.props.style.height-60 : 260}]} 
                    source ={require('../img/my_bg_img.png')}
                ></Image>
                
                {/* 头像部分 */}
                <View id ='top' style={style.topMain}>
                    <View style ={style.headerMain}>
                        <Image id = 'headerPhoto' style = {style.headerPhoto} source = {{uri:ListModel.userHeaderImage(this.props.userDetailInfo)}}></Image>
                        <Image id = 'typeLabel' style={style.typeLabel} source = {{uri:ListModel.userTypeIcon(this.props.userDetailInfo)}} resizeMode = 'contain'></Image>
                    </View>
                    <DGButton   style       = {style.startBtn}
                                title       = '收藏' 
                                img         = 'user_collection_gray_icon' 
                                arrangeType = 'imageInFront' 
                                titleColor  = '#FFFFFF' 
                                titleFont   = {14}></DGButton>
                </View>

                {/* 描述 */}
                <Text id = 'name'  style={{color:'#FFFFFF', fontSize:20,fontWeight:'bold', marginLeft:30,marginTop:10}}>{this.props.userInfo.nickname}</Text>
                <Text id = 'info'  style={{color:'#FFFFFF', fontSize:12, marginLeft:30,marginTop:10}}>{ListModel.basicInfoDescription(this.props.userDetailInfo)}</Text>
                <Text id = 'scope' style={{color:'#FFFFFF', fontSize:12, marginLeft:30,marginTop:10}}>{ListModel.appointmentDescription(this.props.userDetailInfo)}</Text>

                {/* 认证信息 */}
                <View id = 'auth' style ={style.authMainView}>
                    <View id = 'authStatus' style = {style.authStatusView}>
                        <Image id = 'authImage' style = {{height:15,width:15}} source = {{uri:this.props.userDetailInfo.state == 3? 'friends_icon':'alert_icon'}}></Image>
                        <Text id = 'authStatusText' style ={{color:'#FFFFFF',fontSize:12,paddingLeft:5}}>{ListModel.stateTxt(this.props.userDetailInfo)}</Text>
                    </View>
                    <Text id  = 'distance' style ={{color:'#FFFFFF',fontSize:12}}>{ListModel.userDistance(this.props.userInfo)}</Text>
                </View>

                {/* 身材信息 */}
                <View id ='statureInfo' style={style.statureInfoMainView}>
                    {/* 身高 */}
                    <View style = {style.statureInfoSubView}>
                        <Text id ='heightValue'  style ={style.statureInfoSubTitleValue}>{this.props.userDetailInfo.height? this.props.userDetailInfo.height:"暂无"}</Text>
                        <Text id = 'heightTitle' style ={style.statureInfoSubTitle}>身高</Text>
                    </View>

                    <View style = {style.statureInfoSubView}>
                        <Text id ='heightValue'  style ={style.statureInfoSubTitleValue}>{this.props.userDetailInfo.weight? this.props.userDetailInfo.weight:"暂无"}</Text>
                        <Text id = 'heightTitle' style ={style.statureInfoSubTitle}>体重</Text>
                    </View>

                    <View style = {style.statureInfoSubView}>
                        <Text id ='heightValue' style ={style.statureInfoSubTitleValue}>{this.props.userDetailInfo.bust? this.props.userDetailInfo.bust:"暂无"}</Text>
                        <Text id = 'heightTitle' style ={style.statureInfoSubTitle}>胸围</Text>
                    </View>
                    
                </View>

            </View>
        )
    }

}

const style = StyleSheet.create({
    main:{
        flex:1,
        justifyContent:'flex-start',
        backgroundColor:'#F6F4F9',
        flexDirection:'column',
        alignItems:'stretch',
        paddingTop:64
    },
    backImageView:{
        position:'absolute',
        top:0,
        right:0,
        left:0,
        // bottom:60, 图片必须指定高度，这样好像是无效的
    },
    // 头像区域
    topMain:{
        flex:1,
        flexBasis:60,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flexGrow:0,
        marginTop:20
    },
    headerMain:{
        flex:1,
        flexBasis:60,
        height:60,
        width:60,
        flexGrow:0,
        marginTop:10,
        marginBottom:10,
        marginLeft:30,
        backgroundColor:'#FFC1E5',
        borderRadius:30,
    },
    headerPhoto:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        top:0,
        height:60,
        width:60,       
        borderRadius:30,
        overflow:'hidden'
    },
    typeLabel:{
        position:'absolute',
        left:0,
        bottom:0,
        height:16,
        width:32,
        flexBasis:32,
    },
    startBtn:{
        height:30,
        width:96,
        flexBasis:96,
        borderColor:'#FFFFFF',
        borderWidth:1,
        borderRadius:15,
        marginRight:20
    },
    //认证信息
    authMainView:{
        flex:1,
        flexGrow:0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:26,
        flexBasis:26,
        marginTop:30,
        marginBottom:10,
        marginLeft:30,
        marginRight:30,
        paddingRight:10,
        paddingLeft:10,
        backgroundColor:'rgba(0,0,0,0.2)',
        borderRadius:13,
    },
    authStatusView:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    //身材信息
    statureInfoMainView:{
        flex:1,
        flexDirection:'row',
        flexGrow:0,
        alignItems:'stretch',
        height:60,
        flexBasis:60,
        backgroundColor:'white',
        borderRadius:4,
        marginRight:20,
        marginLeft:20,
        //  添加阴影(貌似暂时只支持iOS)
        // elevation: 20,// 安卓的属性
        shadowOffset:{width: 0, height: 3},
        shadowColor: '#999999',
        shadowOpacity: 0.8,
        shadowRadius: 5
    },
    statureInfoSubView:{
        flex:1,
        flexDirection:'column',
        justifyContent:"center",
        alignItems:'center'
    },
    statureInfoSubTitle:{
        color:'#666666',
        fontSize:12
    },
    statureInfoSubTitleValue:{
        color:'#333333',
        fontSize:20,
        margin:3
    }
});