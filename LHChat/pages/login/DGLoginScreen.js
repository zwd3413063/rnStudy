import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    Platform,
    StyleSheet,
    Image,
    TextInput,
    StatusBar,
    Keyboard,
    TouchableOpacity,
    Animated
} from 'react-native';

import DGButton from '../../public/DGButton';
import DGGlobal from '../../config/DGGlobal';
import LHNetWorking ,{LH_LOGIN_PATH} from '../../config/LHNetWorking';

import Storage,{
    local_user_key,
    login_response_info
} from '../../config/storage/DGAsyncStorage';


import AlertView from '../../public/DGAlertView';
import HUD from '../../public/DGHUD';
var SQLite = require('react-native-sqlite-storage')

const Login_accountHeight = 240;    // 账号输入框高度


export default class DGLoginScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            iconTop: (g_screen.topHeight + 20),
            iconLeft: (g_screen.width/2.0 - 50),
            accountViewTop: new Animated.Value(g_screen.topHeight + 200),
            keyboardHeight:0,

            account:'',
            password:'',
        }

        /**
         * 添加键盘事件
         * 安卓设备 keyboardWillShow 与 keyboardWillHide 无效。所以只能使用 keyboardDidShow 与 keyboardDidHide 来代替来。但是效果可能不太好！
        */
        if(g_device.isAndroid){
            this.keyboardShowLister = Keyboard.addListener('keyboardDidShow',this.keyboardWillShow);
            this.keyboardHiddenLister = Keyboard.addListener('keyboardDidHide',this.keyboardWillHidden);
        }else{
            this.keyboardShowLister = Keyboard.addListener('keyboardWillShow',this.keyboardWillShow);
            this.keyboardHiddenLister = Keyboard.addListener('keyboardWillHide',this.keyboardWillHidden);
        }
    }

    // 组件加载完毕
    componentDidMount() {
        StatusBar.setBarStyle('default');
        if(g_device.isAndroid)StatusBar.setBackgroundColor('#FFFFFF');    // 只对安卓有效

        // 获取本地登录记录
        Storage.fetch({key:local_user_key}, 
            (data,error)=>{
                if(data){
                    this.setState({
                        account:data.phone,
                        password:data.password
                    });
                }
            }
        );
    }

    // 路由处理
    // static navigationOptions = {
    //     header:null,    // 单个页面隐藏导航栏
    //   };

    // action 事件处理
    // 结束点击屏幕
    touchEndAction = ()=>{
        Keyboard.dismiss();
    };
    
    // 键盘将要弹出
    keyboardWillShow = (event)=>{
        console.log(event);
        let keybodyOffset = event.endCoordinates;
        let duration = event.duration;
        let accountTop = keybodyOffset.screenY - Login_accountHeight - 20;// 20 为键盘与视图的间歇

        this.setState({keyboardHeight:keybodyOffset.height});
        
        /** 
         * 改变state ，添加了动画效果. 声明 accountViewTop 时需要使用new Animated.Value() 方式声明对象。
         * 而在渲染组件render函数里面。对应的view需要使用<Animated.View/> 组件。而不是我们常用的<View/> 切记
        */
        Animated.timing(
            this.state.accountViewTop,
            {toValue:accountTop,
            duration:duration
            }
        ).start();
    };

    // 键盘将要隐藏
    keyboardWillHidden = (event)=>{
        console.log(event);
        let duration = 0;   // 键盘动画持续时间，安卓在键盘消失时event == null
        if(event) duration = event.duration;
        
        this.setState({keyboardHeight:0});

        //改变state 。添加了动画效果
        Animated.timing(
            this.state.accountViewTop,
            {toValue:(g_screen.topHeight + 200),
            duration:duration
            }
        ).start();

    };

    // 忘记密码
    forgetPasswordAction = ()=>{
        Keyboard.dismiss();
        console.log('忘记密码');
        SQLite.openDatabase({name: 'my.db', location: 'default'});
    };

    //切换登录方式
    codeLoginChangeAction = ()=>{
        this.hud.showText({message:'^_^ !!! 此功能还未开发',options:{after:2000,ableUserTouch:false}});
    }

    // 点击登录
    loginAction = ()=>{
        if(this.state.account.length == 0){
            HUD.showFailed({message:'请输入账号!',options:{after:2000,ableUserTouch:false}});
            return;
        }
        if(this.state.password.length == 0){
            HUD.showFailed({message:'请输入密码!',options:{after:2000,ableUserTouch:false}});
            return;
        }
        Keyboard.dismiss();

        let hud =  HUD.showActivity({message:'正在登录...'})

        let body = {'phone':this.state.account,
                    'password':this.state.password,
                    'type':'1'
                    }
        let net = new LHNetWorking.defaultManager();
        net.post({
            path:LH_LOGIN_PATH,
            body:body,
            successed:(ponse)=>{
                console.log(ponse);

                // 保存登录的账号与密码
                Storage.save({key:local_user_key,data:body});
                // 更新token字段信息
                net.updateToken(ponse.data);
                //保存token信息，有效期一个月
                if(ponse)Storage.save({key:login_response_info,data:ponse.data,timeOut:3600*24*30})
                .then((post)=>{
                    hud.message = '登录成功!';
                    hud.mode = 'succeeded';
                    hud.hidden(2000);
                    // 进入首页
                   this.props.navigation.navigate('tabbarModal');
                }).catch((error)=>{
                    console.log(error);
                    hud.message = error;
                    hud.mode = 'failed';
                    hud.hidden(2000);
                });
            },
            fail:(error)=>{
                console.log(error);
                hud.message = error.message;
                hud.mode = 'failed';
                hud.hidden(2000);
            }
        });

    }

    render(){
        return (
        <TouchableOpacity style = {{flex:1}} onPress ={this.touchEndAction} activeOpacity = {1}>
            <View style = {styles.mainView} >
                {/* icon */}
                <Image style = {[styles.image,{left:this.state.iconLeft,top:this.state.iconTop}]}
                       source = {{uri:'sign_in_logo_img'}} 
                />
                {/* 账号密码输入 */}
                <Animated.View id = 'contentView' style = {[styles.contentView,{marginTop:this.state.accountViewTop}]}>
                    <View id ='accountMainView' style = {contentStyle.contentTextmainView}>
                        <TextInput style = {[{color:'#333333',fontSize:15},contentStyle.contentTextInput]}  
                                   placeholder = '请输入账号'
                                   value = {this.state.account}
                                   onChangeText={(text)=>(this.setState({account:text}))}></TextInput>
                    </View>
                    <View id = 'passwordMainView' style = {contentStyle.contentTextmainView}>
                        <TextInput  style = {[{color:'#333333',fontSize:15},contentStyle.contentTextInput]} 
                                    placeholder = '请输入密码'
                                    value = {this.state.password}
                                    onChangeText={(text)=>(this.setState({password:text}))}></TextInput>
                        <DGButton  style = {contentStyle.contentEyeBtn}  img = 'eye_close'></DGButton>
                    </View>
                    <DGButton id ='forgetPasswordBtn' 
                              style ={contentStyle.forgetPassword} 
                              titleColor = {g_color.mainColor}
                              titleFont  = {14} 
                              title = '忘记密码?'
                              onPress = {this.forgetPasswordAction}/>

                    <DGButton id = 'loginBtn' 
                              style = {contentStyle.login} 
                              title = '登录' 
                              titleColor = '#FFFFFF'
                              titleFont  = {17}
                              onPress = {this.loginAction}/>
                </Animated.View>

                <View id = 'codeBackView' style = {styles.codeBackView}>
                <TouchableOpacity onPress = {this.codeLoginChangeAction}>
                    <Text style = {styles.codeText}>验证码登录</Text>
                </TouchableOpacity>
                </View>


                {/* 协议查看 */}
                <View id =' bottomView' style = {styles.bottomView}>
                    <TouchableHighlight>
                        <View>
                            <Text style = {{fontSize:12,color:'#666666'}}>  
                            登录/注册代表同意
                               <Text style = {{color:g_color.mainColor}}>《用户协议》</Text>
                            和
                               <Text style = {{color:g_color.mainColor}}>《隐私条款》 </Text>
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>

                <HUD ref = {(ref)=>(this.hud = ref)}></HUD>
            </View>
        </TouchableOpacity>
        );
    };
}

const styles = StyleSheet.create(
    {
        mainView:{
            flex:1,
            backgroundColor:'#FFFFFF',
        },
        image:{
            position:'absolute',
            width:100,
            height:100,
            borderRadius:50,
        },
        contentView:{
            flex:1,
            marginLeft:20,
            marginRight:20,
            flexBasis:Login_accountHeight,
            flexGrow:0,
            borderRadius:5.0,
            backgroundColor:'white'
        },
        codeBackView:{
            flex:1,
            flexBasis:50,
            flexGrow:0,
            justifyContent:'center',
            alignItems:'center'
        },
        codeText:{
            flex:1,
            margin:10,
            padding:5,
            textAlign:'center',
            color:g_color.mainColor,
            fontSize:17,
        },
        bottomView:{
            position: 'absolute',
            flexDirection:'column',
            height:40,
            left:0,
            right:0,
            bottom:0,
            alignItems:'center',
            justifyContent:'flex-end',
            paddingBottom:20
        }
    }
);

const contentStyle = StyleSheet.create({
    contentTextmainView:{
        flex:1,
        flexBasis:44,
        marginRight:20,
        marginLeft:20,
        marginTop:20,
        flexGrow:0,
        borderRadius:22,
        paddingLeft:20,
        paddingRight:20,
        flexDirection:'row',
        backgroundColor:'#F5F5F5',
        alignItems:'center',
        flexGrow:1,

    },
    contentTextInput:{
        flex:1,
        flexGrow:1,
    },
    contentEyeBtn:{
        flex:1,
        flexGrow:0,
        flexBasis:22,
        height:22
    },
    forgetPassword:{
        flex:1,
        flexBasis:30,
        marginTop:10,
        marginBottom:10,      
        marginRight:20,
        alignSelf:'flex-end'
    },
    login:{
        flex:1,
        flexBasis:44,
        flexGrow:0,
        marginRight:20,
        marginLeft:20,
        marginBottom:10,
        borderRadius:22,
        backgroundColor:g_color.mainColor,
        //  添加阴影(貌似暂时只支持iOS)
        // elevation: 20,// 安卓的属性
        shadowOffset:{width: 0, height: 3},
        shadowColor: g_color.mainColor,
        shadowOpacity: 0.8,
        shadowRadius: 5
    }
});