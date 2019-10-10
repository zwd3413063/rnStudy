import React, { Component } from 'react';
import {Text,View,FlatList,TouchableHighlight,Platform,StyleSheet,SafeAreaView,StatusBar,Button,TextInput,Dimensions} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DGNavigationBar from '../../public/DGNavigationBar'
import DGGlobal from '../../config/DGGlobal';
import DGSheetView from '../../public/DGSheetView';
import DGAlertView from '../../public/DGAlertView';
import HUD from '../../public/DGHUD';

import LHView from '../../public/LHView';

export default class HomeController extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        if(g_device.isAndroid)StatusBar.setBackgroundColor('#6a51ae');    // 只对安卓有效
    }
    
    leftOnPress = () =>{
        console.log('左边按钮');
        this.props.navigation.navigate('selectCity');
    };
    
    rightOnPress = () =>{
        this.sheetView.show({
            title:'选择',
            actions:['相机','相册'],
            onPress:(index)=>{
                console.log('我点击了：'+index);
            }
        });
    }

    //选择确定
    sheetDoneOnPress =(index)=>{
        console.log(index);
    }

    //HUD
    showHUD = ()=>{
        HUD.showActivity({message:'这个问题你要去问问我的小伙伴们。他们是如何处理的'});
    };

    // 直接显示sheetView
    showsheetForApp = ()=>{
        DGSheetView.show({
            actions:['男','女','阴阳人'],
            onPress:(index)=>{
                console.log('直接显示的：'+index);
            }
        });
    }

    //sheetView
    showSheetView = ()=>{
        this.sheetView.show({
            actions:['相机','相册','相片中心'],
            onPress:(index)=>{
                console.log('你也点我干嘛：'+index);
            }
        });
    };
    
    render(){
        return(
        <LHView style = {styles.mainView}
            title = '首页'  
            leftImage = 'address_icon' 
            leftTitle = '长沙'  
            rightTitle = '查看全部'
            leftOnPress ={this.leftOnPress}
            rightOnPress = {this.rightOnPress}
            tintColor = '#FFFFFF'>

            <KeyboardAwareScrollView style ={{flex:1,flexDirection:'column',paddingTop:100}}>
              <Button onPress = {this.showHUD} title = '显示HUD'></Button>
              <Button onPress = {this.showSheetView} title = '组件通过refs显示SheetView'></Button>
              <Button onPress = {this.showsheetForApp} title = 'show直接显示sheetView'></Button>

              <TextInput style ={{flex:1,flexBasis:60,height:60,backgroundColor:'green'}}></TextInput>
              <TextInput style ={{flex:1,flexBasis:60,height:60,backgroundColor:'pink'}}></TextInput>
              <TextInput style ={{flex:1,flexBasis:60,height:60,backgroundColor:'green'}}></TextInput>
              <TextInput style ={{flex:1,flexBasis:60,height:60,backgroundColor:'pink'}}></TextInput>       
                
            </KeyboardAwareScrollView>

            <DGSheetView ref = {(ref)=>(this.sheetView = ref)} />

        </LHView>
        );
    }

}

const styles = StyleSheet.create(
    {
        mainView:{
            flex:1,
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'stretch',
        },
        flatList:{
            flex:1,
            flexGrow:1
        }
    }
);