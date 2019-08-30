import React, { Component } from 'react';
import {View,
        Text,
        TouchableOpacity,
        StyleSheet,
        Modal,
        Animated,
        AppRegistry
    } 
from 'react-native';

import DGButton from '../public/DGButton';
import DGGlobal from '../config/DGGlobal';

const _itemHeight = 45.0;
let _sheetObject = null;

export default class DGSheetView  extends Component{
    constructor(props){
        super(props);

        // 点击事件
        this.onPress = ()=>{
        };

        this.state = {
            backOpacity:new Animated.Value(0),      // 背景初始值
            contentBottom:new Animated.Value(0),    // 距离底部的距离
            visible:false,
            title:'',
            actions:[],
            contentHeight:0
        };
    }

    static show = ({title,actions,onPress})=>{
        _sheetObject.show({title,actions,onPress});
        return _sheetObject;
    }

    show =({title ='',actions = [],onPress = null})=>{

        let titleHeight = title.length > 0? 25:0;
        let contentHeight = actions.length*_itemHeight + titleHeight;

        this.setState({
            visible:true,
            contentHeight,
            title,
            actions,
            contentBottom:new Animated.Value(-contentHeight-20)
        });
        
        this.onPress = onPress;

        //这里使用定时器，是为了让setState操作先完成。再异步操作动画。不然上面的修改状态，和下面的修改状态操作就会冲突了。
        setTimeout(()=>{
            Animated.parallel([
                // 背景颜色动画
                Animated.timing(               
                    this.state.backOpacity,      
                    {
                        toValue: 0.3,             
                        duration: 300,
                    }
              ),
              Animated.timing(          
                this.state.contentBottom,      
                {
                    toValue: 0,             
                    duration: 300,
                }
              )
    
            ]).start();
        });

        return this;
    };

    hidden =()=>{
        Animated.parallel([
            // 背景颜色动画
            Animated.timing(               
                this.state.backOpacity,      
                {
                    toValue: 0,             
                    duration: 300,
                }
          ),
          Animated.timing(          
            this.state.contentBottom,      
            {
                toValue: (-this.state.contentHeight -20),             
                duration: 300,
            }
          )

        ]).start(this.hideFinished);
    }

    // 动画完成
    hideFinished =({finished})=>{
        this.setState({visible:false});
    }

    createTitleView = (title)=>{
        if(title.length <= 0){
            return <View></View>;
        };
        return(
            <View style = {{flex:1,justifyContent:'center',alignItems:'center',marginTop:10,flexBasis:15,flexGrow:1}}>
                <Text style ={styles.title}>{this.state.title}</Text>
            </View>
        );
    }

    createContentView = (actions)=>{

        let titlViews =  actions.map((item,index,arr)=>{
            let tintColor = '#333333';
            if (index === arr.length-1)tintColor = g_color.mainColor;
            return (
                <DGButton  key  = {index}
                          index = {index} 
                          style = {styles.button} 
                          title = {item} 
                          onPress = {this.didOnPoress}
                          tintColor = {tintColor}
                          titleFont = {15}
                          />
            );
        });
        return titlViews;
    };

    // 点击对应的选择
    didOnPoress = (event,props) =>{
        this.hidden();
        if(this.onPress)this.onPress(props.index);
    };

    render(){
        return(
            <Modal visible = {this.state.visible} transparent ={true}>
            <TouchableOpacity style ={{flex:1,flexDirection:'column'}} onPress={this.hidden} activeOpacity = {1}>
                <Animated.View id= 'backView' style = {[styles.backView,{opacity:this.state.backOpacity}]}>

                </Animated.View>

                <Animated.View id = 'contentView' style ={[styles.contentView,{bottom:this.state.contentBottom,flexBasis:this.state.contentHeight,height:this.state.contentHeight}]}>
                    {this.createTitleView(this.state.title)}
                    {this.createContentView(this.state.actions)}
                </Animated.View>

            </TouchableOpacity>
            </Modal>
        );
    }
}

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
                        <DGSheetView ref = {(ref)=>(_sheetObject =ref)}></DGSheetView>
                    </View>
                );
            };
            
        }
    });
}


const styles = StyleSheet.create({
    backView:{
        backgroundColor:'black',
        flex:1,
        flexGrow:1
    },
    contentView:{
        flex:1,
        justifyContent:'center',
        alignItems:'stretch',
        backgroundColor:'white',
        position:'absolute',
        margin:20,
        borderRadius:10,
        left:0,
        right:0
    },
    title:{
        flex:1,
        color:'#999999',
        fontSize:11,
        flexGrow:1,
    },
    button:{
        flex:1,
        flexBasis:_itemHeight,
        borderBottomColor:'#DCDCDC',
        borderBottomWidth:0.5,
        flexGrow:1,
        marginRight:10,
        marginLeft:10
    }
});