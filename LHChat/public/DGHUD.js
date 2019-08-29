import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    AppRegistry} 
from 'react-native';

import PropTypes from 'prop-types';



export default class DGHUD extends Component{
    constructor(){
        super();
        this.state = {
            mode:'text',
            message:'',
            show:false
        }
    }

    get mode(){
        return this.state.mode;
    };

    set mode(mode){
        this.setState({mode});
    }


    showText = ({message ='',options = {}})=>{
        this.show({message,mode:'text',options});
    };

    showActivity = ({message ='',options = {}})=>{
     this.show({message,mode:'activity',options});
    };

    showSucceeded = ({message ='',options = {}})=>{
        this.show({message,mode:'succeeded',options});
    };

    showFail =  ({message ='',options = {}})=>{
        this.show({message,mode:'failed',options});
    };

    show = ({message ='',mode = 'text',options = {}})=>{
        this.setState({
            show:true,
            message,
            mode
        });
    }

    createActivityView = ()=>{
        if(this.state.mode == 'text'){
            return;
        }else if(this.state.mode == 'activity'){
            return <View>
                
            </View>
        }else if(this.state.mode == 'succeeded'){
            return <View>

            </View>
        }else if(this.state.mode == 'failed'){
            return <View>

            </View>
        }
    }

    render(){
        if(!this.state.show)return null;

        return(
            <View id = 'backgroudView' style = {styles.bakegroundView}>
                <View id = 'contentView' style = {styles.contentView}>
                    {this.createActivityView()}
                    <Text>{this.state.message}</Text>
                </View>
            </View>
        );
    }
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
        justifyContent:'center',
        alignContent:'center'
    },
    contentView:{
        margin:60,
        backgroundColor:'red'
    },
    message:{
        textAlign:'center',
        padding:10
    }

});