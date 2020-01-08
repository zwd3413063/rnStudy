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
                    style ={[style.backImageView,{height:this.props.style.height? this.props.style.height-40 : 260}]} 
                    source ={require('../img/my_bg_img.png')}
                ></Image>
                
                {/* 头像部分 */}
                <View id ='top' style={style.topMain}>
                    <View style ={style.headerMain}>
                        <Image id = 'headerPhoto' style = {style.headerPhoto} source = {{uri:ListModel.userHeaderImage(this.props.userInfo)}}></Image>
                        <Image id = 'typeLabel' style={style.typeLabel} source = {{uri:ListModel.userTypeIcon(this.props.userInfo)}} resizeMode = 'contain'></Image>
                    </View>
                    <DGButton   style       = {style.startBtn}
                                title       = '收藏' 
                                img         = 'user_collection_gray_icon' 
                                arrangeType = 'imageInFront' 
                                titleColor  = '#FFFFFF' 
                                titleFont   = {14}></DGButton>
                </View>

                {/* 描述 */}
                <Text id = 'name'>{this.props.userInfo.nickname}</Text>
                <Text id = 'info'>{ListModel.userDistance(this.props.userInfo)}</Text>
                <Text id = 'scope'>{}</Text>

                {/* 认证信息 */}
                <View id = 'auth'>
                    <Image id = 'authImage'></Image>
                    <Text id = 'authStatusText'></Text>
                    <Text id  = 'distance'></Text>
                </View>

                {/* 身材信息 */}
                <View id ='statureInfo'>
                    {/* 身高 */}
                    <View>
                        <Text id ='heightValue'></Text>
                        <Text id = 'heightTitle'></Text>
                    </View>

                    <View>
                        <Text id ='heightValue'></Text>
                        <Text id = 'heightTitle'></Text>
                    </View>

                    <View>
                        <Text id ='heightValue'></Text>
                        <Text id = 'heightTitle'></Text>
                    </View>
                    
                </View>

            </View>
        )
    }

}

const style = StyleSheet.create({
    main:{
        flex:1,
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
        backgroundColor:'red',
        alignItems:'center'
    },
    headerMain:{
        flex:1,
        flexBasis:60,
        height:60,
        width:60,
        flexGrow:0,
        margin:10,
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
        borderWidth:1
    }
});