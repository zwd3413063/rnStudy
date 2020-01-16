import React, { Component,PureComponent } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Modal,
    Image,
    ScrollView,
    Dimensions
}  from 'react-native';

import DGNavigationBar from 'dg-public/DGNavigationBar';
import ImageZoom from 'react-native-image-pan-zoom';
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

    static getDerivedStateFromProps(nextProps,prevState){
        let state = {};
        if(nextProps.imageModels){
            let index = 0;
            if(nextProps.currentIndex)index = nextProps.currentIndex;
            state.title = (index+1) +'/' + nextProps.imageModels.length;
        }
        return state
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
class DGCheckImageItem extends Component{
    constructor(){
        super();

        this.state = {
            imageWidth:g_screen.width,
            imageHeight:g_screen.width,
            imageTop:0,
            imageLeft:0,
        }
    }

    componentDidMount(){
        this._imageFrame(this.props.item);
    }

    static getDerivedStateFromProps(nextProps,prevState){
        return {};
    }

    // 计算图片的高度
    _imageFrame = (item)=>{
        Image.getSize(item.uri,
            // 成功的回调
            (width,height)=>{
                let ratio   = parseFloat(height)/parseFloat(width);

                let imageWidth   = g_screen.width;
                let imageHeight  = g_screen.width*ratio;
                let imageLeft    = 0;
                let imageTop     = 0;

                if(imageHeight <=g_screen.height){
                    imageWidth= g_screen.width;
                    imageLeft = 0;
                    imageTop  = (g_screen.height - imageHeight)/2.0;
                }else{
                    imageHeight= g_screen.height;
                    imageWidth = g_screen.height/ratio;
                    imageLeft  = (g_screen.width - imageWidth)/2.0;
                    imageTop   = 0;
                }
                this.setState((state)=>({imageWidth,imageHeight,imageLeft,imageTop}));
            },
            // 失败的回调
            (error)=>{
                let imageWidth  = g_screen.width;
                let imageHeight = g_screen.width;
                let imageLeft   = 0;
                let imageTop    = (g_screen.height - g_screen.width)/2.0;
                this.setState((state)=>({imageWidth,imageHeight,imageLeft,imageTop}));
            }
        );
    }

    render(){
        return(
            <View style = {styles.imageItem}>
                {/* <ScrollView cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={this.state.imageWidth}
                       imageHeight={this.state.imageHeight}>
                        <Image style={{height:this.state.imageHeight,width:this.state.imageWidth}}
                                source={{uri:this.props.item.uri}}/>
                </ScrollView> */}
                <ImageZoom  cropWidth={Dimensions.get('window').width}
                            cropHeight={Dimensions.get('window').height}
                            imageWidth={this.state.imageHeight}
                            imageHeight={this.state.imageHeight}>
                    <Image source = {{uri:this.props.item.uri}} 
                            style = {{position: 'absolute',left:this.props.imageLeft,top:this.props.imageTop,height:this.state.imageHeight,width:this.state.imageWidth,backgroundColor:'#696969'}}></Image>
                </ImageZoom>
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
    },
    itemImage:{
    
    }
});