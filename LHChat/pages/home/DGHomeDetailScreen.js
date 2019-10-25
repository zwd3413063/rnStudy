import React, { Component } from 'react';

import {
    View,
    FlatList,
    StyleSheet,
}  from 'react-native';

import DGNavigationBar from '../../public/DGNavigationBar';


export default class DGHomeDetailScreen extends Component{
    constructor(){
        super()
        this.state = {
            title:'用户详情'
        }
    }

    componentDidMount(){
        console.log(this.props.navigation.state.params);
    }

    render(){
        return(
            <View>
                <FlatList>

                </FlatList>

                <DGNavigationBar title = {this.state.title} 
                                tintColor   = '#FFFFFF'
                                navigation  = {this.props.navigation}
                />
            </View>
        )
    }

}

