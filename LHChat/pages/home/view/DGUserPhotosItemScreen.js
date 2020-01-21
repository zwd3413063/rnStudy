import React ,{Component} from 'react';

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    findNodeHandle
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
        this.visibleItemIndexs = [];    // 可见的items的index
        this.refItems          = {};    // 所有items的DOM信息
    }

    // 获取可见的cells
    _onViewableItemsChanged = ({ viewableItems, changed }) => {
        this.visibleItemIndexs = viewableItems.map((value)=>(value.index));
      }

    //action点击事件
    onPress = (item,index,imageRef)=>{
        if(this.props.onPress) this.props.onPress(item,index,imageRef);
    }


    // 渲染每一行
    _renderItem = (item, index)=>{
        let imageRef = null;
        return (
            <TouchableOpacity onPress = {()=>(this.onPress(item,index,imageRef))}>
                <View style ={[styles.renderItem,{width:this.props.style.height-10}]}>
                    <Image  id      =   'subItem1'
                            style   =   {{backgroundColor:'#FFC1E5',position:'absolute',left:0,top:0,right:0,height:this.props.style.height-10}}
                            source  =   {{uri:item.uri}}
                            ref     =   {(ref)=>{
                                            imageRef = ref;
                                            this.refItems[index] = ref;
                                        }}
                        />
                </View>
            </TouchableOpacity>
        )
    }

    // 获取某一行的DOM信息
    _getRefItem = (index)=>{
        // 首先判断是否在可见范围。不在可见范围的不反悔信息
        // indexOf 函数返回的是元素在数组中第一次出现的索引，没出现过就返回-1
      if(this.visibleItemIndexs.indexOf(index)== -1)return null;
        
        // 然后去查询
        let imageRef = this.refItems[index];
        return imageRef;
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
                           renderItem   = {({item, index, separators})=>(this._renderItem(item, index))}
                           keyExtractor = {(item,index)=>(index.toString())}
                           showsHorizontalScrollIndicator = {false}
                           onViewableItemsChanged = {this._onViewableItemsChanged}
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