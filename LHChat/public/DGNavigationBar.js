import React, { PureComponent } from 'react';
import {View,Text,TouchableHighlight,StyleSheet} from 'react-native';
import DGButton from '../public/DGButton';
import Global from '../config/DGGlobal';
import NavigationService  from '../config/NavigationService';

export default class DGNavigationBar extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            leftImage: null,
            leftTitle: null,
            index:0,
            leftAlignmentType:'center',
            leftMarginLeft:0,
        };
     }
     
     // 组件加载完毕
     componentDidMount(){
        if(!this.props.navigation)return;

        const parent = this.props.navigation.dangerouslyGetParent();
        this.setState(paramsState =>({index:parent.state.index}));
        
        if(parent.state.index > 0){
            this.setState(paramsState =>{
                return {leftImage: '导航返回', leftTitle: null,leftAlignmentType:'left',leftMarginLeft:10};
            });
        }else{
            this.setState(paramsState =>{
                return {leftImage: null,leftTitle: null,leftAlignmentType:'center'};
            });
        }
    }
    
    // action
    leftOnPress = ()=>{
        if(!this.props.navigation)return;
        const parent = this.props.navigation.dangerouslyGetParent();
        if(parent.state.index >0){
            NavigationService.goback();
        }
    }

    _contentView = (props)=> {
        if(props.title){
            return(
                <View id ='contentView' style ={styles.contentView}>
                    <Text style = {[styles.contentViewTitle,{color:props.tintColor}]}>{props.title}</Text>
                </View>
            );
    
        }else if(props.contentView){
            return props.contentView;
    
        }else{
            return(
                <View id ='contentView' style ={[styles.contentView,{color:props.tintColor}]}>
                </View>
            );
        }
    }

    render(){
        return(
        <View id ='mainView' style ={[styles.mainView]}>
       
            <DGButton id = 'leftView' style ={[styles.leftView,{marginLeft: this.state.leftMarginLeft}]} 
                      tintColor = {this.props.tintColor}
                      title = {this.props.leftTitle? this.props.leftTitle:this.state.leftTitle} 
                      img = {this.props.leftImage? this.props.leftImage:this.state.leftImage}
                      onPress = {this.props.leftOnPress? this.props.leftOnPress:this.leftOnPress}
                      alignmentType = {this.state.leftAlignmentType}
                      />
    
            {/* 内容视图，根据给定的属性来显示 */}
            {this._contentView(this.props)}
    
            <DGButton id = 'rightView'
                      tintColor = {this.props.tintColor}
                      style ={styles.rightView}
                      title = {this.props.rightTitle} 
                      img = {this.props.rightImage}
                      onPress = {this.props.rightOnPress}/>
        </View>
        );
    }

}

const styles = StyleSheet.create(
    {
        mainView:{
            position:'absolute',
            height:g_screen.topHeight,
            top:0,
            right:0,
            left:0,
            flex:1,
            flexDirection:'row',
            flexGrow:0,
            flexBasis:g_screen.topHeight,
            alignItems:'flex-end',
            backgroundColor:"#E10B68"
        },
        rightView:{
            flexBasis:80,
            flexGrow:0,
            height:44.0,
        },
        contentView:{
            flexGrow:1,
            height:44.0,
            alignItems:'center',
            justifyContent:'center'
        },
        leftView:{
            flexBasis:80,
            flexGrow:0,
            height:44.0,
        },
        contentViewTitle:{
            color:"#FFFFFF",
            fontSize:18,
            fontWeight:'bold'
        }
    }
);