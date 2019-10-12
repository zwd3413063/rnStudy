import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';

/**
 *   loadType :  start 、 stoped 、failed
 * 
*/
export default class DGloadingView extends Component{
    constructor(props){
        super(props);
        this.state = {
            loadType:'start', // 'stoped','failed' 
            titleText:'正在加载...',
            display:'none', //  'none','flex'
        }
    }

    // get/set
    get loadType(){
        return this.state.loadType;
    }

    set loadType(loadType){
        let titleText = '';
        let display = 'none';
        if(loadType == 'start'){
            titleText = this.props.startText? this.props.startText:"正在加载...";
            display = 'flex';
        }else  if(loadType == 'stoped'){
            titleText = this.props.startText? this.props.stopText:"加载完成!";
            display = 'none';
        }else  if(loadType == 'failed'){
            titleText = this.props.startText? this.props.stopText:"加载失败啦，点我重新加载!";
            display = 'flex';
        }

        this.setState({loadType, titleText,display});
    }
    
    get isLoading(){
        return this.state.loadType == 'start'? true:false;
    }

    // create
    _contentView = (loadType)=>{
        if(loadType == 'start'){
            return (
                <View>
                    <ActivityIndicator size="large" color="#999999" ></ActivityIndicator>
                </View>
            )
        }else if (loadType == 'stoped'){
            return (
                <View>
                    <Image source={require('./img/load_failed.png')} />
                </View>
            )
        }else if (loadType == 'failed'){
            return (
                <View>
                    <Image source={require('./img/load_failed.png')} />
                </View>
            )
        }

    }

    render(){
        // 这是一个空的View
        if(this.state.display == 'none'){
            return (
                <View>

                </View>
            );
        }else{
            return(
                <TouchableOpacity style={styles.touchView} activeOpacity = {1} onPress = {this.props.onPress}>
                    <View id ='contentView' style = {[styles.mainView,{display:this.state.display}]}>
                        {/* 图片还是活动指示器 */}
                        {this._contentView(this.state.loadType)}
                        {/* 这里是下面的text */}
                        <Text numberOfLines = {5} style = {styles.text}>
                            {this.state.titleText}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }


    }

}

const styles = StyleSheet.create({
    touchView:{
        flex:1,
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
    },
    mainView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFFFFF'
    },
    text:{
        color:'#999999',
        fontSize:16,
        margin:20,

    }
});