import React, { Component,PureComponent } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Modal,
    Image,
    ScrollView,
    Dimensions,
    PanResponder,
    TouchableOpacity
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
            scrollEnabled:true, // 是否可以滑动，主要是为了大图查看时，不能让底部的滑动视图响应手势 
            maxIndex:0,         // 最大图片数量
            showIndex:0,        // 初始点击的第几张图片
            isShowed:false      // 此字段为了判断是否为visible 显示或者关闭。只调用一次。不然props和state会冲突。没得办法呀！
        }
        this.contentOffset ={x:0,y:0};
    }

    static getDerivedStateFromProps(nextProps,prevState){
        let state = {...prevState};
        if(nextProps.imageModels)   state.maxIndex = nextProps.imageModels.length;
        if(nextProps.visible && !state.isShowed){
            state.isShowed = true;
            state.showIndex = nextProps.currentIndex;

        }else  if(!nextProps.visible && state.isShowed){
            state.isShowed = false;
        }
        return state;
    }

    _data = ()=>{
        if(this.props.imageModels)return this.props.imageModels;
        if(this.props.imageURLs)return this.props.imageURLs;
        return [];
    }

    //更新title
    _updateTitle = (index)=>{
        return (index+1)+'/'+this.state.maxIndex;
    }

    // 判断可否改变滑动状态
    _scrollEnabledClick = (able)=>{
        let intValue = 0;
        if(this.contentOffset){ intValue = this.contentOffset.x/Dimensions.get('window').width;}
        if(intValue%1==0){
            if(this.state.scrollEnabled != able){
                this.setState((state)=>({scrollEnabled : able}));
            }
        }
    }

    // 恢复滑动
    _recoverMove = (able) =>{
        this.setState((state)=>({scrollEnabled : able}));
    }

    // 滑动停止
    _onScrollEndDrag = (event)=>{
        this.contentOffset = event.nativeEvent.contentOffset;
        let currentIndex = parseInt(this.contentOffset.x/Dimensions.get('window').width);
        if(this.props.changeCurrentIndex)this.props.changeCurrentIndex(currentIndex);
    }

    // 关闭
    _dismiss =()=>{
        if(this.props.dismiss)this.props.dismiss();
    }

    render(){
        return (
            <Modal visible = {this.props.visible}>
                <View style ={{flex:1,backgroundColor:'#000000'}}>
                    <FlatList
                        data            = {this._data()}
                        renderItem      = {({item})=>(<DGCheckImageItem item = {item} 
                                                                        changeSuperAbleMove = {this._scrollEnabledClick} 
                                                                        recoverMove = {this._recoverMove}
                                                                        onPress = {this._dismiss}
                                                                        />)}

                        keyExtractor    = {(item,index) =>(index.toString())}
                        horizontal      = {true}
                        showsHorizontalScrollIndicator = {false}
                        pagingEnabled   = {true}
                        scrollEnabled   = {this.state.scrollEnabled}
                        ref             = {(ref)=>(this._flatlist = ref)}
                        onScrollEndDrag = {this._onScrollEndDrag}
                        contentOffset   = {{x:this.state.showIndex*Dimensions.get('window').width,y:0}}
                        onMomentumScrollEnd = {this._onScrollEndDrag}
                    />

                    <DGNavigationBar    backgroundColor = {'rgba(0,0,0,0.1)'}
                                        title = {this._updateTitle(this.props.currentIndex)} 
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

        // 父类scrollView是否可以滑动
        this.superAbleMove = true;
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
      // 单击
      _onPress =()=>{
          if(this.props.onPress)this.props.onPress();
      }

      // 长按
      _onLongPress = ()=>{
          console.log('长按');
      }

      // 放手
      _responderRelease = ()=>{
          if(this.props.recoverMove)this.props.recoverMove(this.superAbleMove);
      }

      // 移动
      _onMove = (position)=>{
          if(position.scale <= 1){
            this.superAbleMove = true;
            if(this.props.changeSuperAbleMove)this.props.changeSuperAbleMove(this.superAbleMove);
          }else{
            // 公式:  边界值 = ((图片宽度*放大比例)/2 - 屏幕宽度/2)/放大比例。取绝对值
            let boundValue = ((this.state.imageWidth*position.scale)/2 - Dimensions.get('window').width/2)/position.scale;
             /** 划出边界恢复scrollView的滑动功能
              * -4 是在快要超过时就可以滑动下一页了*/ 
            if(Math.abs(position.positionX)>=boundValue){
                this.superAbleMove = true;
                if(this.props.changeSuperAbleMove)this.props.changeSuperAbleMove(this.superAbleMove);
            }else{
                this.superAbleMove = false;
                if(this.props.changeSuperAbleMove)this.props.changeSuperAbleMove(this.superAbleMove);
            }
          }
      }

    render(){
        return(
            <View style = {styles.imageItem}>
                <ImageZoom  cropWidth={Dimensions.get('window').width}
                            cropHeight={Dimensions.get('window').height}
                            imageWidth={Dimensions.get('window').width}
                            imageHeight={this.state.imageHeight}
                            onClick = {this._onPress}
                            onLongPress = {this._onLongPress}
                            horizontalOuterRangeOffset = {this._horizontalOuterRangeOffset}
                            onMove = {this._onMove}
                            responderRelease = {this._responderRelease}
                            >
                    <Image source = {{uri:this.props.item.uri}} 
                            style = {{position: 'absolute',left:this.props.imageLeft,top:this.props.imageTop,height:this.state.imageHeight,width:this.state.imageWidth,backgroundColor:'#696969'}}
                            />
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