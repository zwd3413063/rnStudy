import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';

/**
 * Realm的使用
 */
var RealmBase = {};

import Realm from 'realm';

const HomeSchame = {
    name:'HomeData',
    properties:{
        id:'int',
        title:'string',
        image:'string',
        mall:'string',
        pubtime:'string',
        fromsite:'string',
    }
};

const HTSchame = {
    name:'HTData',
    properties:{
        id:'int',
        title:'string',
        image:'string',
        mall:'string',
        pubtime:'string',
        fromsite:'string',
    }
};


export default class DGMessageHomeScreen extends React.PureComponent{
     constructor(props){
         super(props);
         // 初始化realm
        let realm = new Realm({schema:[HomeSchame, HTSchame]});
     }

     render(){
        return(
            <View style = {{flex:1}}>
                <Text>消息中心</Text>
            </View> 
        )
     }
}