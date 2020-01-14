import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ActivityIndicator,
    Animated,
    AppRegistry} 
from 'react-native';

import PropTypes from 'prop-types';

let _hud = null;

export default class DGHUD extends Component{
    constructor(){
        super();

        this.state = {
            mode:'text',
            message:'',
            show:false,
            messagePadding : 20,
            ableUserTouch:true,
            contentOpacity:new Animated.Value(0),           // 弹出框背景初始值
        }

        this.timer = null;
    }
    get mode(){
        return this.state.mode;
    };
    set mode(mode){
        this.setState({mode});
    }

    get message(){
        return this.state.message;
    }
    set message(message){
        let padding = this.state.mode === 'text'? 10:20;
        let messagePadding = message.length == 0? 0:padding;
        this.setState({message,messagePadding});
    }

    static showText = ({message ='',mode = 'text',options = {}})=>{
        _hud.show({message,mode,options});
        return _hud;
    }

    showText = ({message ='',options = {}})=>{
        this.show({message,mode:'text',options});
    };

    static showActivity = ({message ='',mode = 'activity',options = {}})=>{
        _hud.show({message,mode,options});
        return _hud;
    }

    showActivity = ({message ='',options = {}})=>{
     this.show({message,mode:'activity',options});
    };

    static showSucceeded = ({message ='',mode = 'succeeded',options = {}})=>{
        _hud.show({message,mode,options});
        return _hud;
    }

    showSucceeded = ({message ='',options = {}})=>{
        this.show({message,mode:'succeeded',options});
    };

    static showFailed = ({message ='',mode = 'failed',options = {}})=>{
        _hud.show({message,mode,options});
        return _hud;
    }

    showFailed =  ({message ='',options = {}})=>{
        this.show({message,mode:'failed',options});
    };

    static show = ({message ='',mode = 'text',options = {}})=>{
        _hud.show({message,mode,options});
        return _hud;
    }

    show = ({message ='',mode = 'text',options = {}})=>{
        let padding = mode === 'text'? 10:20;
        let messagePadding = message.length == 0? 0:padding;
        // 是否挡住组件的交互
        let ableUserTouch = (!('ableUserTouch' in options) || options.ableUserTouch == true)? true:false;
        // 多少秒后隐藏
        let after = options.after;
        // 如果定时器存在了。就要先删除
        if(this.timer)clearTimeout(this.timer);

        this.setState({
            show:true,
            message,
            messagePadding,
            mode,
            ableUserTouch
        });

        Animated.timing(
            this.state.contentOpacity,
            {
                toValue:1,
                duration:300
            }
        ).start();

        if(after > 0)this.hidden(after);
        return this;
    }

    hidden = (after)=>{
      this.timer = setTimeout(() => {
            Animated.timing(
                this.state.contentOpacity,
                {
                    toValue:0,
                    duration:300
                }
            ).start(this.hiddenFinished);

        }, after);
    }

    hiddenFinished =()=>{
        this.setState({show:false});
    }

    // 是否阻断屏幕事件
    ableUserTouch = ()=>{
        return false;
    }

    // 创建中间内容视图
    createActivityView = (mode)=>{
        if(mode == 'text'){
            return;
        }else if(mode == 'activity'){
            return (
                <View style = {styles.activity}>
                            <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
                );
        }else if(mode == 'succeeded'){
            return (
                <View style = {[styles.image]}>
                    <Image style = {{flex:1}} source = {{uri:'hud成功'}}></Image>
                </View>
                );
        }else if(mode == 'failed'){
            return (
            <View style = {[styles.image]}>
                <Image style = {{flex:1}} source = {{uri:'hud错误'}}></Image>
            </View>
            );
        }
    }

    render(){
        if(!this.state.show)return null;

        return(
            <View id = 'backgroudView' style = {styles.bakegroundView} pointerEvents= {this.state.ableUserTouch? 'auto':'none'}>
                <Animated.View id = 'contentView' style = {[styles.contentView,{opacity:this.state.contentOpacity}]}>
                    {this.createActivityView(this.state.mode)}

                    <Text style = {[styles.message,{padding:this.state.messagePadding,paddingTop:10}]}>
                        {this.state.message}
                    </Text>
                </Animated.View>
            </View>
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
                        <DGHUD ref= {ref =>(_hud = ref)}></DGHUD>
                    </View>
                );
            };
            
        }
    });
}

DGHUD.propTypes = {
    mode   : PropTypes.oneOf(['text','activity','succeeded','failed']),
};

const styles = StyleSheet.create({
    bakegroundView:{
        position:'absolute',
        backgroundColor:'transparent',
        top:0,
        left:0,
        bottom:0,
        right:0,
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    contentView:{
        flex:0,
        margin:40,
        backgroundColor:'rgba(0,0,0,0.6)',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        flexGrow:0,
        //  添加阴影(貌似暂时只支持iOS)，这个报错。不晓得为啥
        shadowOffset:{width: 0, height: 3},
        shadowColor:'black',
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    activity:{
        flex:1,
        flexBasis:40,
        width:40,
        marginTop:20,
        marginRight:20,
        marginLeft:20,
        flexGrow:0,
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        flex:1,
        flexBasis:50,
        width:50,
        marginTop:20,
        marginRight:20,
        marginLeft:20,
        flexGrow:0,
    },
    message:{
        color:'white',
        fontSize:15,
    }

});