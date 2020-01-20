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
    TouchableOpacity,
    UIManager,
    Animated,
    findNodeHandle,
    Easing
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
                scrollEnabled:true,     // 是否可以滑动，主要是为了大图查看时，不能让底部的滑动视图响应手势 
                maxIndex:0,             // 最大图片数量
                showIndex:0,            // 初始点击的第几张图片
                isShowed:false,         // 此字段为了判断是否显示大图查看
                currentIndex:0,         // 当前的页面
                imageItems:[],          // 图片数组
                animationStatus:0,      // 等待显示

                /*动画相关*/
                animationOpacity:new Animated.Value(0),     // 背景黑
                animationTop:new Animated.Value(0),         // 图片位置
                animationLeft:new Animated.Value(0),        // 图片位置
                animationWidth:new Animated.Value(100),     // 图片位置
                animationHeight:new Animated.Value(100),    // 图片位置
            }
            this.contentOffset ={x:0,y:0};
            this.showInImageRect = {imageWidth:0,imageHeight:0,imageLeft:0,imageTop:0};// 显示图片的尺寸，这个是可以率先计算出来的
        }

        // 关闭
        _dismiss =()=>{
            this.setState((state)=>({isShowed:false}));
            if(this.props.dismiss)this.props.dismiss();
        }
    
        // 显示
        _show = ({imageModels,imageURLs,showIndex = 0,imageRef})=>{
            let state = {};
            state.isShowed = true;
            state.showIndex = showIndex;
            state.currentIndex = showIndex;
            state.animationStatus = 0;
            // 设置图片数组
            let datas = [];
            if(imageModels){
                let index = 0;
                datas = imageModels.map((item) =>{
                    let newItem = {...item,index:index,visible:true};
                    index++;
                    return newItem;
                });
            }
            if(imageURLs){
                let index = 0;
                datas = imageURLs.map((uri)=>{
                    let item = {uri,index,visible:true};
                    index ++;
                    return item;
                });
            }
            state.imageItems = datas;
            state.maxIndex = datas.length;
            this.setState((OldState)=>({...state}));

            // 显示动画
            let item = state.imageItems[showIndex];
            if(state.imageItems.length>0)this._starAnimation(item,imageRef);
            
        }
    

    // 动画
    _starAnimation = (item,imageRef)=>{
        // 恢复默认值
        if(imageRef){
            const handle = findNodeHandle(imageRef);
            UIManager.measureInWindow(handle,(x, y, width, height)=>{
                this.setState((state)=>({
                    animationOpacity:new Animated.Value(0),     // 背景黑
                    animationTop:new Animated.Value(y),         // 图片位置
                    animationLeft:new Animated.Value(x),        // 图片位置
                    animationWidth:new Animated.Value(width),   // 图片位置
                    animationHeight:new Animated.Value(height), // 图片位置
                }));
            });
        }

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

                // 保存一下这个图片的尺寸信息
                this.showInImageRect = {imageHeight,imageWidth,imageLeft,imageTop}

                // 设置动画属性（延时一下执行。不然有BUG）
                setTimeout(() => {
                    let duration = 300;// 动画时间
                    Animated.timing(this.state.animationOpacity,{toValue:1,duration}).start();
    
                    let animtaion1 =  Animated.timing(this.state.animationLeft,{toValue:imageLeft,duration,easing: Easing.ease});
                    let animtaion2 =  Animated.timing(this.state.animationTop,{toValue:imageTop,duration,easing: Easing.ease});
                    let animtaion3 =  Animated.timing(this.state.animationWidth,{toValue:imageWidth,duration,easing: Easing.ease});
                    let animtaion4 =  Animated.timing(this.state.animationHeight,{toValue:imageHeight,duration,easing: Easing.ease});
                    // 启动动画
                    this.setState((state)=>({animationStatus:1}));
                    Animated.parallel([animtaion1,animtaion2,animtaion3,animtaion4]).start(()=>{
                        // 动画结束后关闭视图
                        this.setState((state)=>({animationStatus:2}));
                    });
                }, 100);

            },
            // 失败的回调
            (error)=>{
                let imageWidth  = g_screen.width;
                let imageHeight = g_screen.width;
                let imageLeft   = 0;
                let imageTop    = (g_screen.height - g_screen.width)/2.0;
            }
        );
    }

    //获取动画起始位置的大小
    _getStarPoint = (separators)=>{

    }

    //更新title
    _updateTitle = (index)=>{
        return (index+1)+'/'+this.state.maxIndex;
    }

    // 判断可否改变滑动状态
    _scrollEnabledClick = (able)=>{
        let intValue = 0;
        if(this.contentOffset){ intValue = parseFloat(this.contentOffset.x)/Dimensions.get('window').width;}
        if(intValue%1==0){
            if(this.state.scrollEnabled != able){
                this.setState((state)=>({scrollEnabled : able}));
            }
        }
    }

    // 恢复滑动
    _recoverMove = (able) =>{
        if(this.state.scrollEnabled != able){
            this.setState((state)=>({scrollEnabled : able}));
        }
    }

    // 滑动停止
    _onScrollEndDrag = (event)=>{
        this.contentOffset = event.nativeEvent.contentOffset;
        let currentIndex = parseInt(this.contentOffset.x/Dimensions.get('window').width);
        // 切换时，将放大的图片恢复原来的大小
        if(this.state.currentIndex != currentIndex){
           let imageItems = this.state.imageItems.map((item)=>{
               let visible = (currentIndex === item.index)? true:false;
               return {...item,visible};
           });
           this.setState((state)=>({currentIndex,imageItems}));
        }
    }

    // 滑动
    _onScroll = (event)=>{
        this.contentOffset = event.nativeEvent.contentOffset;
    }

    render(){
        // 页面准备中
        if(this.state.animationStatus == 0){
            console.log('页面准备');
            return null;
        }
        // 正在动画中
        if(this.state.animationStatus == 1){
            console.log('动画进行中...');
            return(
                <Modal transparent = {true} style = {{flex:1}}>
                    <Animated.View style = {{flex:1,backgroundColor:'#000000',opacity:this.state.animationOpacity}}>
                    </Animated.View>
                    <Animated.Image source = {{uri:this.state.imageItems[this.state.showIndex].uri}} 
                        style  = {{position:'absolute',
                                    top:this.state.animationTop,
                                    left:this.state.animationLeft,
                                    width:this.state.animationWidth,
                                    height:this.state.animationHeight}}>
                    </Animated.Image>
                </Modal>
            );
        }
        // 动画完了。展示正式图
        if(this.state.animationStatus == 2){
            return (
                <Modal visible = {this.state.isShowed}>
                    <View style ={{flex:1,backgroundColor:'#000000'}}>
                        <FlatList
                            data            = {this.state.imageItems}
                            renderItem      = {({item})=>(<DGCheckImageItem item = {item} 
                                                                            changeSuperAbleMove = {this._scrollEnabledClick} 
                                                                            recoverMove = {this._recoverMove}
                                                                            onPress = {this._dismiss}
                                                                            defaultRect = {this.state.showIndex === item.index? this.defaultRect:null}
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
                            onScroll        = {this._onScroll}
                        />
    
                        <DGNavigationBar    backgroundColor = {'rgba(0,0,0,0.1)'}
                                            title = {this._updateTitle(this.state.currentIndex)} 
                                            tintColor   = '#FFFFFF'
                                            titleColor  = '#FFFFFF'
                                            leftOnPress = {this.leftOnPress}
                        />
                    </View>
                </Modal>
            )
        }

    }
}

//****************************************************************************************************************/
//****************************************************************************************************************/
//****************************************************************************************************************/
// item 数据
class DGCheckImageItem extends PureComponent{
    constructor(){
        super();

        this.state = {
            imageWidth:g_screen.width,
            imageHeight:g_screen.width,
            imageTop:0,
            imageLeft:0,
            backgroundColor:'red'
        }

        // 父类scrollView是否可以滑动
        this.superAbleMove = true;
    }

    componentDidMount(){
        this._imageFrame(this.props.item);
        this._resetScalelisten(this.props.item);
    }

    static getDerivedStateFromProps(nextProps,prevState){
        let state = {};
        console.log(nextProps);
        if(nextProps.defaultRect){
            state = {...nextProps.defaultRect};
        }
        return state;
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
                let backgroundColor = 'blue';
                this.setState((state)=>({imageWidth,imageHeight,imageLeft,imageTop,backgroundColor}));
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

      // 监听是否恢复缩放比例
      _resetScalelisten =(visible)=>{
        if(!visible && this._imageZoomRef){
            this._imageZoomRef.reset();
        }
      }

      // 放手
      _responderRelease = ()=>{
          if(this.props.recoverMove)this.props.recoverMove(true);
      }

      // 移动
      _onMove = (position)=>{
          if(position.scale <= 1){
            this.superAbleMove = true;
            if(this.props.changeSuperAbleMove)this.props.changeSuperAbleMove(this.superAbleMove);
          }else{
            // 公式:  边界值 = ((图片宽度*放大比例)/2 - 屏幕宽度/2)/放大比例。取绝对值
            let boundValue = ((this.state.imageWidth*position.scale)/2 - Dimensions.get('window').width/2)/position.scale;
             /** 划出边界恢复scrollView的滑动功能*/
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
        this._resetScalelisten(this.props.item.visible);
        return(
            <View style = {[styles.imageItem,{backgroundColor:this.state.backgroundColor}]}>
                <ImageZoom  cropWidth={Dimensions.get('window').width}
                            cropHeight={Dimensions.get('window').height}
                            imageWidth={Dimensions.get('window').width}
                            imageHeight={this.state.imageHeight}
                            onClick = {this._onPress}
                            onLongPress = {this._onLongPress}
                            horizontalOuterRangeOffset = {this._horizontalOuterRangeOffset}
                            onMove = {this._onMove}
                            doubleClickInterval = {300}
                            responderRelease = {this._responderRelease}
                            ref = {(ref)=>{this._imageZoomRef = ref}}
                            >
                    <Image source = {{uri:this.props.item.uri}} 
                            style = {{position: 'absolute',left:0,top:0,height:this.state.imageHeight,width:this.state.imageWidth,backgroundColor:'#696969'}}
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