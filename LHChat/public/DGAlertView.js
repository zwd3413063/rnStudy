import React, { Component } from 'react';
import {Text,View,FlatList,TouchableOpacity,StatusBar,StyleSheet,Animated,AppRegistry} from 'react-native';
import DGGlobal from '../config/DGGlobal';
import DGButton from '../public/DGButton';

let _dgAlertObject = null;

export default class DGAlertView extends Component{

    constructor(){
        super();
        this.state ={
            visible:false,
            backOpacity:new Animated.Value(0),              // 背景初始值
            contentScale:new Animated.Value(1.3),           // 弹出框初始大小
            contentOpacity:new Animated.Value(0),           // 弹出框背景初始值
            title:'',
            message:'',
            actions:[],
            options:null
        };

        // 点击对应按钮事件
        this.onPress = null;
    }

    static show =({title ='',message = '',actions = [],options = null,onPress =null})=>{
        _dgAlertObject.show({title,message,actions,options,onPress});
        return _dgAlertObject;
    }

    // 打开
    show = ({title ='',message = '',actions = [],options = null,onPress =null})=>{
        this.setState((state)=>({
            visible:true,
            title,
            message,
            actions
        }));
        this.onPress = onPress;

        Animated.parallel([
            Animated.timing(
                this.state.backOpacity,
                {
                    toValue:0.3,
                    duration:300
                }
            ),
            Animated.timing(
                this.state.contentScale,
                {
                    toValue:1.0,
                    duration:300
                }
            ),
            Animated.timing(
                this.state.contentOpacity,
                {
                    toValue:1,
                    duration:300
                }
            )
        ]).start();
    }

    // 关闭
    done = (event,props)=>{
        this.dismiss();
        if(this.onPress)this.onPress(props.index,this);
    }

    dismiss = ()=>{
        Animated.parallel([
            Animated.timing(
                this.state.backOpacity,
                {
                    toValue:0,
                    duration:300
                }
            ),
            Animated.timing(
                this.state.contentScale,
                {
                    toValue:1.3,
                    duration:300
                }
            ),
            Animated.timing(
                this.state.contentOpacity,
                {
                    toValue:0,
                    duration:300
                }
            )
        ]).start(this.doneFinishedAction);
    }

    // 关闭动画完成
    doneFinishedAction = ()=>{
        this.setState((state)=>({visible:false}));
    }

    // 创建底部按钮
    createBottomSubView =(actions)=>{
        let views  = Array();

        for (let i = 0; i <actions.length;i++) {
            let title =  actions[i];
            let style;
            let color;
            if(i === actions.length - 1){
                style = styles.doneBtnView;
                color = '#FFFFFF';
            }else{
                style = styles.otherBtnView;
                color = g_color.mainColor;
            } 

            let view  = <View key = {i} style ={style} >
                            <DGButton index ={i} title = {title} tintColor = {color} titleColor = {color} style ={{flex:1,fontSize:12}} onPress ={this.done}></DGButton>
                        </View>
            views.push(view);
        }
        return views;
    }

    render(){
        if(!this.state.visible)return null;

        return(
            <TouchableOpacity style = {{flex:1,position:'absolute',top:0,bottom:0,left:0,right:0}} activeOpacity = {1}>

                    <Animated.View style = {{flex:1,backgroundColor:'black',justifyContent:'center',alignItems:'center',flexDirection:'row',opacity:this.state.backOpacity}} >
                    </Animated.View>
   
                    <View id ='contentBackView' style ={styles.contentBackView}>

                        <Animated.View id ='alertView' style = {[
                            styles.alertContentView,
                            {
                                opacity:this.state.contentOpacity,
                                transform:[{scale:this.state.contentScale}]
                            }
                            ]}>

                            <View id = 'titleView' style = {styles.titleView}>
                                <Text ellipsizeMode ='tail' numberOfLines ={1} style = {styles.title}>{this.state.title}</Text>
                            </View>

                            <View id = 'contentView' style ={{justifyContent:'center',alignItems:'center'}}>
                                <Text ellipsizeMode ='tail' numberOfLines ={10} style = {styles.message}>{this.state.message}</Text>
                            </View>

                            <View id = 'bottomView' style = {styles.bottomView}>
                                {this.createBottomSubView(this.state.actions)}
                            </View>

                        </Animated.View>
                    </View>

            </TouchableOpacity>
        );
    }
}

// 直接加到跟组件上
// 在根视图中注册一个SheetView
const originRegister = AppRegistry.registerComponent;

AppRegistry.registerComponent = (appkey,component)=>{
    return originRegister(appkey,function(){
        const OriginAppComponent = component();

        return class extends Component{

            render(){
                return(
                    <View style ={{flex:1,position:'relative'}}>
                        <OriginAppComponent></OriginAppComponent>
                        <DGAlertView ref = {ref =>(_dgAlertObject = ref)}></DGAlertView>
                    </View>
                );
            };
            
        }
    });
}

const styles = StyleSheet.create({
    alertContentView:{
        flex:1,
        flexDirection:'column',
        margin:40.0,
        backgroundColor:'white',
        borderRadius:5.0,
    },
    contentBackView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        flexDirection:'row',
        top:0,
        bottom:0,
        left:0,
        right:0
    },
    titleView:{
        flex:1,
        flexBasis:50,
        flexGrow:0,
        justifyContent:'center',
        alignItems:'center'
    },
    bottomView:{
        flex:1,
        flexBasis:60,
        flexGrow:0,
        flexDirection:'row',
    },
    title:{
        color:'#333333',
        fontSize:17,
        paddingLeft:20,
        paddingRight:20
    },
    message:{
        color:'#999999',
        fontSize:14,
        paddingLeft:10,
        paddingRight:10,
    },
    doneBtnView:{
        flex:1,
        flexGrow:1,
        justifyContent:'center',
        alignItems:'stretch',
        color:'#FFFFFF',
        backgroundColor:g_color.mainColor,
        borderRadius:5.0,
        margin: 10
    },
    otherBtnView:{
        flex:1,
        flexGrow:1,
        justifyContent:'center',
        alignItems:'stretch',
        color:g_color.mainColor,
        borderRadius:5.0,
        borderColor:g_color.mainColor,
        borderWidth:1.0,
        margin: 10,
    }

});