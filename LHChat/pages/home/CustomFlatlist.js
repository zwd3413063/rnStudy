import React, { Component } from 'react';

import {
    View,
    FlatList,
    StyleSheet,
    Text
}  from 'react-native';

import RefreshList from '../../public/DGRefresh/DGRefreshList'

export default class CustomFlatlist extends Component{
    constructor(){
        super();
        this.state = {
            data :[{key:"A"},
                   {key:"B"},
                   {key:"C"},
                   {key:"D"},
                   {key:"E"},
                   {key:"F"},
                   {key:"G"},
                   {key:"H"},
                   {key:"I"},]
        }
    }

    flatRenderItem = (item) =>{
        return(
            <Text style = {{flex:1,height:80,borderBottomColor: "#999999",alignItems:"center",justifyContent:'center'}}>{item.item.key}</Text>
        )
    }

    render(){
        return(
            <View style = {{flex:1,backgroundColor:'#green'}}>
                <RefreshList
                    data = {this.state.data}
                    renderItem = {this.flatRenderItem}
                />
            </View>
        ) 
    }

}