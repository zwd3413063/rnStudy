import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
}  from 'react-native';

import Button from '../../public/DGButton'
import {lh_image_base_url} from '../../config/DGGlobal'

export default class DGHomeItem extends Component{
    constructor(){
        super();
    }

    // 用户类型
    _userTypeIcon = (item)=>{
        if(item.isQuality)return "yz_icon";
        if(item.state == '3') return "really_icon";
        return null;
    }
    
    // 职业描述
    _userDescription = (item)=>{
        let des = "";
        if(item.career)des = item.career;
        if(item.age) des = des + "·" + item.age + "岁";
        if(item.city) des = des + "." + item.city;
        return des;
    }

    // 用户头像地址拼接
    _userHeaderImage = (item)=>{
        let url = lh_image_base_url + item.pic;
        return url;
    }
    
    
    // 距离、上次登录时间描述
    _userDistance = (item)=>{
        let des = "";
        if(item.distance < 1000)dis = "距离" + item.distance + "米";
        else dis =  "距离" + parseInt(item.distance/1000)+ "千米";

        if(item.updateTime >0){
            let currentTimestemp =  Date.parse(new Date());
            let difference = (currentTimestemp - item.updateTime)/1000;
            if (difference < 60)dis = dis + ".刚刚";
            else if (difference <60*60)dis = dis + "." + difference/60 + "分钟前";
            else if (difference <60*60*24)dis = dis + "." + difference/(60*60) + "小时前";
            else if (difference <60*60*24*30)dis = dis + "." + difference/(60*60*24) + "天前";
            else  dis = dis + "." + difference/(60*60*24*30) + "个月前";
        }
        return dis;
    }

    // 点击事件
    _onPress = ()=>{
       if(this.props.onPress)this.props.onPress(this.props.itemData);
    }

    render(){
        return(
        <TouchableOpacity onPress = {this._onPress}>
            <View style = {styles.mainView}>
                {/* 左边头像 */}
                <View id = 'leftView' style = {styles.leftView}>
                    <Image id = 'headerPhoto' style = {styles.headerPhoto} source = {{uri:this._userHeaderImage(this.props.itemData.item)}}></Image>
                    <Image id = 'typeLabel' style={styles.typeLabel} source = {{uri:this._userTypeIcon(this.props.itemData.item)}} resizeMode = 'contain'></Image>
                </View>

                {/* 中间姓名、职业 */}
                <View id = 'centerView' style ={styles.centerView}>

                    {/* 昵称、相册数量 */}
                    <View id = 'nickNameMain' style ={styles.nickNameMain}>
                        <Text id ='nickName' style = {{fontSize:15}}>
                            {this.props.itemData.item.nickname}
                        </Text>
                        <Image id = 'photoIcon' style ={{height:13,width:11,marginLeft:4}} source = {{uri:'Photo_icon_mini'}} resizeMode = 'contain'></Image>
                        <Text id ='photoCount' style = {{fontSize:12,color:'#E10B68'}}>
                            {this.props.itemData.item.countPhoto}
                        </Text>
                    </View>
                    {/* 职业、城市描述 */}
                    <Text id = 'description' style = {{fontSize:10,color:'#E10B68',marginTop:5}}>
                        {this._userDescription(this.props.itemData.item)}
                    </Text>
                    <Text id ='distance' style = {{fontSize:10,color:'#999999',marginTop:6}}>
                        {this._userDistance(this.props.itemData.item)}
                    </Text>
                </View>

                {/* 右边收藏/是否付费 */}
                <View id = 'rightView' style={styles.rightView}>
                    <Button id = 'payPhoto' 
                         style = {{height:20,width:70,marginRight:20,display:this.props.itemData.item.showPhoto? "flex":"none"}}
                   arrangeType = "imageInFront" 
                           img = "money_icon"
                         title = "付费相册"
                     tintColor = "#FEA925"
                     titleFont = {10}
                 alignmentType = "right"
                   ></Button>

                    <Image  id = 'collect' 
                         style = {{height:22,width:22,marginTop:10,marginRight:20}}
                        source = {{uri:this.props.itemData.item.collect? "Collection_light":"Collection_gray"}}
                        resizeMode = 'contain'></Image>
                </View>

                {/* 分割线 */}
                <View style ={{position:'absolute',bottom:0,left:15,right:0,height:0.5,backgroundColor:'#F0F0F0'}}></View>

            </View>
        </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    // 主视图
    mainView:{
        flex:1,
        flexDirection:'row',
        alignItems:'stretch',
        height:80,
    },

    // 左边视图
    leftView:{
        flex:1,
        flexBasis:60,
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
    // 中间视图
    centerView:{
        flex:1,
        flexGrow:1,
        justifyContent:'flex-start'
    },

    nickNameMain:{
        flex:1,
        flexDirection:'row',
        height:20,
        flexBasis:20,
        alignItems:'center',
        flexGrow:0,
        marginTop:10
    },

    // 右边视图
    rightView:{
        flex:1,
        flexBasis:90,
        flexGrow:0,
        flexDirection:'column',
        justifyContent:"center",
        alignItems:'flex-end'
    } 

})