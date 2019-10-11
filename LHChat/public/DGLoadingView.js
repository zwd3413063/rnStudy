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
            titleText:'正在加载...'
        }
    }

    // get/set
    get loadType(){
        return this.state.loadType;
    }

    set loadType(loadType){
        let titleText = '';
        if(loadType == 'start')titleText = this.props.startText? this.props.startText:"正在加载...";
        else  if(loadType == 'stoped')titleText = this.props.startText? this.props.stopText:"加载完成!";
        else  if(loadType == 'failed')titleText = this.props.startText? this.props.stopText:"加载失败啦，点我重新加载!";

        this.setState({loadType, titleText});
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
        return(
            <TouchableOpacity style={{flex:1}} onPress = {this.props.onPress}>
                <View style = {styles.mainView}>
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

const styles = StyleSheet.create({
    mainView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        display:'none'
    },
    text:{
        color:'#999999',
        fontSize:16,
        margin:20
    }
});