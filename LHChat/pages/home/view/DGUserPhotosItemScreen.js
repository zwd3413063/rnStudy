import React ,{Component} from 'react';

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity
}  from 'react-native';

import DGButton from 'dg-public/DGButton';

/*
    imageModels 相册图片数组
    showPhoto   相册是否收费， YES：公开。NO：收费
    photoMoney  相册价格
*/
export default class PhotosItemScreen extends Component{
    constructor(){
        super();
    }

    //action点击事件
    onPress = (item,index)=>{
        if(this.props.onPress) this.props.onPress(item,index);
    }

    // 渲染每一行
    _renderItem = (item, index, separators)=>{
        return (
            <TouchableOpacity onPress = {()=>(this.onPress(item,index))}>
                <View style ={[styles.renderItem,{width:this.props.style.height-10}]}>
                    <Image  style = {{backgroundColor:'#FFC1E5',position:'absolute',left:0,top:0,right:0,height:this.props.style.height-10}}
                            source ={{uri:item.uri}}
                        />
                </View>
            </TouchableOpacity>
        )
    }

    render(){
        // 相册锁
        if(this.props.showPhoto == false){
            return(
                <View style ={[this.props.style, {flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#FFC1E5'}]}>
                    <DGButton   style = {{backgroundColor:g_color.mainColor,borderRadius: 13, height:26, flexBasis: 26, width:200}}
                                title = {"点击解锁相册("+parseInt(this.props.photoMoney)+"狐币)"}
                                titleColor = "#FFFFFF"
                    />
                </View>
            )
        }

        // 没有相册
        if(!this.props.imageModels || this.props.imageModels.length == 0){
            return(
                <View style = {[this.props.style,{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#FFFFFF'}]}>
                    <Text style ={{color:"#999999",fontSize:25}}>暂   无</Text>
                </View>
            )
        }

        // 显示相册
        return(
            <View style={[this.props.style,{flex:1,backgroundColor:'#FFFFFF',borderBottomWidth:0.5,borderBottomColor:'#DCDCDC'}]}>
                <FlatList  style        = {{flex:1}} 
                contentContainerStyle   = {{alignItems:'stretch',padding:5}}
                           horizontal   = {true}
                           data         = {this.props.imageModels}
                           renderItem   = {({item, index, separators})=>(this._renderItem(item, index, separators))}
                           keyExtractor = {(item,index)=>(index.toString())}
                           showsHorizontalScrollIndicator = {false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    renderItem:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'red',
        margin:2
    }
});