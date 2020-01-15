import React, { Component,PureComponent } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Modal,
    Image,
    ScrollView
}  from 'react-native';

import DGNavigationBar from 'dg-public/DGNavigationBar'

/*
imageModels 
imageURLs
*/
export default class DGCheckImageView extends Component{
    constructor(){
        super();

        this.state = {
            title:'0/0'
        }
    }

    componentDidMount(){
       if(this.props.imageModels)this.setState((state)=>({title:'1/'+this.props.imageModels.length}));
    }

    _data = ()=>{
        if(this.props.imageModels)return this.props.imageModels;
        if(this.props.imageURLs)return this.props.imageURLs;
        return [];
    }

    render(){
        return (
            <Modal visible = {this.props.visible? this.props.visible:false}>
                <View style ={{flex:1,backgroundColor:'#000000'}}>
                    <FlatList
                        data            = {this._data()}
                        renderItem      = {({item})=>(<DGCheckImageItem item = {item}></DGCheckImageItem>)}
                        keyExtractor    = {(item,index) =>(index.toString())}
                        horizontal      = {true}
                        showsHorizontalScrollIndicator = {false}
                        pagingEnabled   = {true}
                    />

                    <DGNavigationBar    backgroundColor = {'rgba(0,0,0,0.1)'}
                                        title = {this.state.title} 
                                        tintColor   = '#FFFFFF'
                                        titleColor  = '#FFFFFF'
                                        leftOnPress = {this.leftOnPress}
                    />
                </View>
            </Modal>

        )
    }
}

// item 数据
class DGCheckImageItem extends PureComponent{
    constructor(){
        super();

        this.state = {
            imageWidth:g_screen.width,
            imageHeight:g_screen.width,
            imageTop:0
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
       
    }

    // 计算图片的高度
    _imageFrame = (item)=>{
        Image.getSize(item.uri,
            // 成功的回调
            (width,height)=>{

            },
            // 失败的回调
            (error)=>{

            },
            );
    }

    render(){
        return(
            <View style = {styles.imageItem}>
                <ScrollView style ={{flex:1,backgroundColor:'red'}}>
                    <Image source = {{uri:this.props.item.uri}} style = {{width:g_screen.width,height:300}}></Image>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageItem:{
        flex:1,
        height:g_screen.height,
        width:g_screen.width,
        flexBasis:g_screen.width
    }
});