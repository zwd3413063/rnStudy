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
    LayoutAnimation,
    UIManager,
    Animated,
    findNodeHandle,
    Easing
}  from 'react-native';

import DGNavigationBar from 'dg-public/DGNavigationBar';
import ImageZoom from 'react-native-image-pan-zoom';

const ITEM_WIDTH = Dimensions.get('window').width;
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
            animationImageOpacity:new Animated.Value(1),
            animationTop:0,
            animationLeft:0,
            animationWidth:100,
            animationHeight:100
        }
        this.contentOffset ={x:0,y:0};
        this.showInImageRect = {imageWidth:0,imageHeight:0,imageLeft:0,imageTop:0};// 显示图片的尺寸，这个是可以率先计算出来的
    }

    // 关闭
    _dismiss =({imageTop,imageLeft,imageHeight,imageWidth})=>{
        //1、 先展示过渡视图
        this.setState({animationHeight:imageHeight,
                        animationWidth:imageWidth,
                        animationLeft:imageLeft,
                        animationTop:imageTop,
                        animationImageOpacity:new Animated.Value(1),
                        animationOpacity:new Animated.Value(1),     // 背景黑
                        animationStatus:1});

        // 2、再去处理动画信息
        let imageRef = null;
        if(this.props.getItemRef)imageRef = this.props.getItemRef(this.state.currentIndex);
        // 有图片尺寸信息（说明当前的cell是可见的）
        if(imageRef){
            const handle = findNodeHandle(imageRef);
            UIManager.measureInWindow(handle,(x, y, width, height)=>{
                // 设置动画属性（延时一下执行。不然有BUG）
                setTimeout(() => {
                    let duration = 400;// 动画时间
                    // 这里的加100（毫秒）是为了保证下面的动画执行100%完成
                    Animated.timing(this.state.animationOpacity,{toValue:0,duration:duration+100}).start(()=>{
                        // 动画结束后关闭视图
                        this.setState((state)=>({animationStatus:0,isShowed:false}));
                        if(this.props.dismiss)this.props.dismiss();
                    });
                    //启动动画。调用此函数后。再修改state，就会产生动画效果
                    this._configAnimation(duration);
                    this.setState({animationHeight:height,animationWidth:width,animationLeft:x,animationTop:y});
                }, 100);
            });
        
        // 没有图片尺寸信息（说明当前的cell已经划出了屏幕，或者没有实现this.props.getItemRef函数）
        }else{
            let duration = 300;// 动画时间
            Animated.timing(this.state.animationImageOpacity,{toValue:0,duration}).start(()=>{
                // 动画结束后关闭视图
                this.setState((state)=>({animationStatus:0,isShowed:false}));
                if(this.props.dismiss)this.props.dismiss();
            });
        }
    }
    
    // 显示
    _show = ({imageModels,imageURLs,showIndex = 0,imageRef})=>{
        let state = {};
        state.isShowed = true;
        state.showIndex = showIndex;
        state.currentIndex = showIndex;
        state.animationStatus = 0;
        state.animationImageOpacity = 1;
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
        if(state.imageItems.length>0)this._starAnimation(item,showIndex);
        
    }
    

    // 动画
    _starAnimation = (item,showIndex)=>{
        let imageRef = null;
        if(this.props.getItemRef)imageRef = this.props.getItemRef(showIndex);

        // 恢复默认值
        if(imageRef){
            const handle = findNodeHandle(imageRef);
            UIManager.measureInWindow(handle,(x, y, width, height)=>{
                this.setState((state)=>({
                    animationOpacity:new Animated.Value(0),     // 背景黑
                    animationTop:y,
                    animationLeft:x,
                    animationWidth:width,
                    animationHeight:height,
                    animationStatus:1
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
                    let duration = 400;// 动画时间
                    // 这里的加100（毫秒）是为了保证下面的动画执行100%完成
                    Animated.timing(this.state.animationOpacity,{toValue:1,duration:duration+100}).start(()=>{
                        // 动画结束后关闭视图
                        this.setState((state)=>({animationStatus:2,showIndex}));
                    });

                    this._configAnimation(duration);//启动动画。调用此函数后。再修改state，就会产生动画效果
                    this.setState({animationHeight:imageHeight,animationWidth:imageWidth,animationLeft:imageLeft,animationTop:imageTop});

                }, 100);

            },
            // 失败的回调
            (error)=>{
                // 直接显示图片。没有动画了                
                let duration = 300;// 动画时间
                Animated.timing(this.state.animationImageOpacity,{toValue:1,duration}).start(()=>{
                    // 动画结束后关闭视图
                    this.setState((state)=>({animationStatus:2,showIndex}));
                });
            }
        );
    }

    // 动画配置
    _configAnimation =(duration)=>{
        // LayoutAnimation 动画，比直接使用animationed性能要高很多。直接调用的native动画库，而animated使用的JS动画,所以大家都懂的：卡的跟逼一样。
        LayoutAnimation.configureNext({
            duration: duration,   // 动画持续时间
            // 若是新布局的动画类型
            create: {    
                type: 'easeInEaseOut',  // 线性模式，LayoutAnimation.Types.linear 写法亦可
                property: 'opacity'     // 动画属性，除了opacity 还有一个 scaleXY 可以配置，LayoutAnimation.Properties.opacity 写法亦可
            },
            // 若是布局更新的动画类型
            update: {  
                type: 'easeInEaseOut',   // 缓入缓出
                property: 'opacity'      // 动画属性，除了opacity 还有一个 scaleXY 可以配置，LayoutAnimation.Properties.opacity 写法亦可
            }
            });
    }

    /*****滑动代理函数******/
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

    // 设置显示位置
    _contentOffset = (showIndex)=>{
        console.log('当前页面:',showIndex,"  x:",showIndex*Dimensions.get('window').width);
        return {x:showIndex*Dimensions.get('window').width,y:0};
    }

    render(){
        // 页面准备中
        if(this.state.animationStatus == 0){
            console.log('页面准备');
            return null;
        }

        console.log("加载完成!",this.state.showIndex);
        return (
            <Modal visible = {true} transparent = {true}>
                {/* 展示正式图 */}
                <View style ={{flex:1,backgroundColor:'#000000',opacity:(this.state.animationStatus == 2? 1:0)}}>
                        <FlatList
                            data            = {this.state.imageItems}
                            renderItem      = {({item})=>(<DGCheckImageItem item = {item} 
                                                                            changeSuperAbleMove = {this._scrollEnabledClick} 
                                                                            recoverMove = {this._recoverMove}
                                                                            onPress = {this._dismiss}
                                                                            defaultRect = {this.state.showIndex === item.index? this.showInImageRect:null}
                                                                            />)}
                            keyExtractor    = {(item,index) =>(index.toString())}
                            horizontal      = {true}
                            showsHorizontalScrollIndicator = {false}
                            pagingEnabled   = {true}
                            scrollEnabled   = {this.state.scrollEnabled}
                            ref             = {(ref)=>(this._flatlist = ref)}
                            onScrollEndDrag = {this._onScrollEndDrag}
                            onMomentumScrollEnd = {this._onScrollEndDrag}
                            onScroll        = {this._onScroll}
                            initialScrollIndex = {this.state.showIndex}
                            getItemLayout   ={(data, index) => ({length: 375, offset:375 *index,index})}
                        />

                        <DGNavigationBar    backgroundColor = {'rgba(0,0,0,0.1)'}
                                            title = {this._updateTitle(this.state.currentIndex)} 
                                            tintColor   = '#FFFFFF'
                                            titleColor  = '#FFFFFF'
                                            leftOnPress = {this.leftOnPress}
                        />
                </View>

                {/* 动画过渡视图 */}
                <View style = {{position:'absolute',left:0,top:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0)',opacity:(this.state.animationStatus == 1? 1:0)}}
                      pointerEvents = 'none'>
                    <Animated.View style = {{flex:1,opacity:this.state.animationImageOpacity,pointerEvents:'auto'}}>
                        <Animated.View style = {{flex:1,backgroundColor:'#000000',opacity:this.state.animationOpacity}}>
                        </Animated.View>

                        <Image source = {{uri:this.state.imageItems[this.state.currentIndex].uri}} 
                            style  = {{position:'absolute',
                                        top:this.state.animationTop,
                                        left:this.state.animationLeft,
                                        width:this.state.animationWidth,
                                        height:this.state.animationHeight,
                                        }}>
                        </Image>
                    </Animated.View>
                </View>

            </Modal>
        )

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
          if(this.props.onPress)this.props.onPress({...this.state});
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
            <View style = {[styles.imageItem,{backgroundColor:'#000000'}]}>
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