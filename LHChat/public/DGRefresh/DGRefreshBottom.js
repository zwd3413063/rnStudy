

import React ,{Component} from 'react';

import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';


export default class DGRefreshBottom extends Component{
    constructor(){
        super();

    }

    contentView =(status) =>{
        if(status){
            return(
            <View style = {[{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'},this.props.style]}>
                <ActivityIndicator  style = {{margin:10}} color="#999999" animating = {true}/>
                <Text style ={{color:'#999999',fontSize:12}}>{this.props.text}</Text>
            </View>
            )
        }else{
            return(
                <View style = {[{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'},this.props.style]}>
                    <Text style ={{color:'#999999',fontSize:12}}>{this.props.text}</Text>
                </View>
                )
        }
    }

    render(){
      return (this.contentView(this.props.status));
    }
}